import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
var BLOG_DIR = path.resolve(__dirname, 'src/data/blog_json');
function collectJson(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(function (entry) {
        var full = path.join(dir, entry.name);
        if (entry.isDirectory())
            return collectJson(full);
        return entry.name.endsWith('.json') ? [full] : [];
    });
}
/**
 * Serves `virtual:blog-index` - every blog post's metadata with the `content`
 * field stripped out. The listing page only needs titles and excerpts, so this
 * keeps megabytes of article markdown out of the shared chunk; the body is
 * fetched lazily per article instead.
 */
function blogIndexPlugin() {
    var virtualId = 'virtual:blog-index';
    var resolvedId = '\0' + virtualId;
    return {
        name: 'blog-index',
        resolveId: function (id) {
            return id === virtualId ? resolvedId : null;
        },
        load: function (id) {
            if (id !== resolvedId)
                return null;
            var posts = collectJson(BLOG_DIR).map(function (file) {
                var post = JSON.parse(fs.readFileSync(file, 'utf-8'));
                delete post.content;
                post.contentKey = './blog_json/' + path.relative(BLOG_DIR, file).split(path.sep).join('/');
                return post;
            });
            return "export default ".concat(JSON.stringify(posts));
        },
        configureServer: function (server) {
            server.watcher.add(BLOG_DIR);
            var invalidate = function (file) {
                if (!path.resolve(file).startsWith(BLOG_DIR))
                    return;
                var mod = server.moduleGraph.getModuleById(resolvedId);
                if (mod)
                    server.moduleGraph.invalidateModule(mod);
                server.ws.send({ type: 'full-reload' });
            };
            server.watcher.on('add', invalidate);
            server.watcher.on('change', invalidate);
            server.watcher.on('unlink', invalidate);
        },
    };
}
/**
 * GitHub Pages has no server-side rewrite, so a direct hit on /blog/<slug>
 * would return the stock GitHub 404 page instead of the app. Pages serves
 * 404.html for any unmatched path, so shipping a copy of index.html there
 * lets React Router take over and deep links work.
 *
 * Also drops a .nojekyll file so Pages skips Jekyll processing entirely
 * (Jekyll silently ignores paths beginning with an underscore).
 */
function githubPagesSpaFallback() {
    return {
        name: 'gh-pages-spa-fallback',
        apply: 'build',
        closeBundle: function () {
            var outDir = path.resolve(__dirname, 'dist');
            var indexHtml = path.join(outDir, 'index.html');
            if (!fs.existsSync(indexHtml))
                return;
            fs.copyFileSync(indexHtml, path.join(outDir, '404.html'));
            fs.writeFileSync(path.join(outDir, '.nojekyll'), '');
        },
    };
}
// https://vitejs.dev/config/
export default defineConfig({
    base: '/my-portfolio/',
    plugins: [react(), blogIndexPlugin(), githubPagesSpaFallback()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
        },
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'animation': ['framer-motion'],
                    'ui': ['lucide-react'],
                },
            },
        },
    },
});

import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { PortfolioTemplate } from '@/components/portfolio/templates/minimal'
import { dummyPortfolio } from '@/lib/dummy-data'

export default function Portfolio() {
    const portfolio = dummyPortfolio

    return (
        <>
            <Helmet>
                <title>{portfolio.fullName || 'Portfolio'}</title>
                <meta name="description" content={portfolio.tagline || 'Professional Portfolio'} />
            </Helmet>

            <PortfolioTemplate portfolio={portfolio} isPreview={false} isLoggedIn={false} />
        </>
    )
}

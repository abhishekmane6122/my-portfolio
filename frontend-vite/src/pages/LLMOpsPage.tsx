import { Helmet } from 'react-helmet-async'
import LLMOpsLifecycle from '@/components/portfolio/LLMOpsLifecycle'

export default function LLMOpsPage() {
    return (
        <>
            <Helmet>
                <title>LLMOps Lifecycle | Abhishek Mane</title>
                <meta name="description" content="Interactive visualization of LLMOps lifecycle from development to production" />
            </Helmet>

            <LLMOpsLifecycle />
        </>
    )
}

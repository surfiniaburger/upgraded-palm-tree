import Footer from "@/components/footer";
import GeminiAI from "@/components/GeminiAi";
import HealthRecordVerification from "@/components/health-record"
import { HomePage } from "@/components/homepage";
// import { ModeToggle } from "@/components/ModeToggle";
import HealthRiskAssessment from "@/components/risk-assessment";
import Chatbot from "@/components/Medbot"
export default function Home() {
  return (
    <div>
      <HomePage/>
      <Chatbot/>
      <GeminiAI/>
      <HealthRecordVerification/>
      <HealthRiskAssessment/>
      <Footer/>
    </div>
  );
}
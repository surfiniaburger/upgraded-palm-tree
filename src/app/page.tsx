import GeminiAI from "@/components/GeminiAi";
import HealthRecordVerification from "@/components/health-record"
import HealthRiskAssessment from "@/components/risk-assessment";

export default function Home() {
  return (
    <div>
      <GeminiAI />
      <HealthRecordVerification/>
      <HealthRiskAssessment/>
    </div>
  );
}
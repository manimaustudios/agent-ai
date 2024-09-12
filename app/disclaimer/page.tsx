import Navbar from "@/components/Navbar";
import Link from "next/link";

// export const runtime = "edge";

function Page() {
  return (
    <main className="relative mx-auto flex min-h-screen max-w-screen-lg flex-col items-start justify-start space-y-4 px-4 text-left">
      <Navbar />
      <div className="mx-auto max-w-screen-md space-y-4 pb-10 pt-6 text-sm text-muted-foreground">
        <h2 className="text-lg text-foreground">Disclaimer</h2>
        <p>Effective Date: June 1, 2024</p>
        <p>
          By using{" "}
          <Link
            href="/"
            className="text-foreground hover:text-primary hover:underline"
          >
            AITherapistFree.com
          </Link>{" "}
          (&quot;the Website&quot;), you acknowledge and agree to the following:
        </p>

        <h3 className="text-base text-foreground">
          1. Not a Substitute for Professional Help
        </h3>
        <p>
          AITherapistFree.com is an AI-powered chatbot service designed for
          informational and educational purposes only. It is NOT a substitute
          for professional medical advice, diagnosis, or treatment. The AI does
          not replace licensed mental health professionals, psychiatrists,
          psychologists, or any other healthcare providers.
        </p>

        <h3 className="text-base text-foreground">
          2. No Professional Relationship
        </h3>
        <p>
          Use of this Website does not create a therapist-patient relationship.
          The AI chatbot is not capable of forming such a relationship and
          should not be considered as providing professional mental health
          services.
        </p>

        <h3 className="text-base text-foreground">
          3. No Diagnosis or Treatment
        </h3>
        <p>
          The Website does not provide medical diagnoses, treatment plans, or
          prescriptions. Any information provided by the AI should not be
          considered as a diagnosis of any health condition or a recommendation
          for any specific treatment.
        </p>

        <h3 className="text-base text-foreground">4. Emergency Situations</h3>
        <p>
          If you are experiencing a mental health emergency, suicidal thoughts,
          or any situation that poses an immediate risk to your health or
          safety, immediately call your local emergency services or visit the
          nearest emergency room.
        </p>

        <h3 className="text-base text-foreground">
          5. Accuracy of Information
        </h3>
        <p>
          While we strive to provide helpful information, we make no
          representations or warranties of any kind, express or implied, about
          the completeness, accuracy, reliability, suitability, or availability
          of the information provided by the AI chatbot.
        </p>

        <h3 className="text-base text-foreground">6. User Responsibility</h3>
        <p>
          Users are solely responsible for their decisions and actions based on
          information provided by the Website. We strongly encourage users to
          consult with qualified healthcare professionals for any medical or
          mental health concerns.
        </p>

        <h3 className="text-base text-foreground">
          7. Limitation of Liability
        </h3>
        <p>
          To the fullest extent permitted by applicable law,
          AITherapistFree.com, its owners, operators, employees, and affiliates
          shall not be liable for any direct, indirect, incidental,
          consequential, or punitive damages arising out of or relating to the
          use of, or inability to use, the Website or the information it
          provides.
        </p>

        <h3 className="text-base text-foreground">
          8. No Guarantee of Results
        </h3>
        <p>
          We do not guarantee any specific results from the use of our Website.
          Individual experiences may vary, and outcomes are dependent on many
          factors beyond our control.
        </p>

        <h3 className="text-base text-foreground">9. Age Restriction</h3>
        <p>
          This service is not intended for use by individuals under the age of
          18. If you are under 18, please do not use this service and seek help
          from a parent, guardian, or appropriate professional.
        </p>

        <h3 className="text-base text-foreground">10. Changes to Disclaimer</h3>
        <p>
          We reserve the right to modify this disclaimer at any time without
          prior notice. Continued use of the Website after any such changes
          constitutes your acceptance of the new disclaimer.
        </p>

        <p>
          By using{" "}
          <Link
            href="/"
            className="text-foreground hover:text-primary hover:underline"
          >
            AITherapistFree.com
          </Link>
          , you acknowledge that you have read, understood, and agree to be
          bound by this disclaimer. If you do not agree with any part of this
          disclaimer, you must not use our Website.
        </p>
      </div>
    </main>
  );
}

export default Page;

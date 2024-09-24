import Navbar from "@/components/Navbar";

// export const runtime = "edge";

function Page() {
  return (
    <main className="relative mx-auto flex min-h-screen max-w-screen-lg flex-col items-start justify-start space-y-4 px-4 text-left">
      <Navbar />
      <div className="mx-auto max-w-screen-md space-y-4 pb-10 pt-6 text-sm text-muted-foreground">
        <h2 className="text-lg text-foreground">Terms of Service</h2>
        <p>Effective Date: September 1, 2024</p>

        <h3 className="text-base text-foreground">1. Acceptance of Terms</h3>
        <p>
          By accessing or using AITherapistFree.com (&quot;the Website&quot;),
          you (&quot;the User&quot;) agree to comply with and be bound by these
          Terms of Service (&quot;Terms&quot;). If you do not agree to these
          Terms, you must not use the Website.
        </p>

        <h3 className="text-base text-foreground">2. Service Description</h3>
        <p>
          AITherapistFree.com offers general information and support through an
          AI chatbot (&quot;the Service&quot;). This Service does not constitute
          professional mental health advice, diagnosis, or treatment.
        </p>

        <h3 className="text-base text-foreground">3. No Professional Advice</h3>
        <p>
          The content provided by AITherapistFree.com is for informational
          purposes only and does not replace professional mental health advice.
          Always consult with a licensed mental health professional or other
          qualified healthcare provider for any medical or mental health
          concerns.
        </p>

        <h3 className="text-base text-foreground">
          4. Disclaimers and Limitation of Liability
        </h3>
        <p>
          a. The Service is provided &quot;as is&quot; and &quot;as
          available&quot; without warranties of any kind, either express or
          implied.
        </p>
        <p>
          b. AITherapistFree.com, its affiliates, and its operators disclaim all
          liability for any damages arising from your use of the Service. By
          using the Service, you agree to indemnify and hold harmless
          AITherapistFree.com from any and all claims, liabilities, damages, or
          expenses, including legal fees, that arise from your use of the
          Service.
        </p>

        <h3 className="text-base text-foreground">5. User Conduct</h3>
        <p>
          Users agree to use the Service lawfully and ethically. You shall not
          engage in any conduct that is harmful, disruptive, or abusive to
          others or the Service. AITherapistFree.com reserves the right to
          investigate and take appropriate legal action against anyone who, in
          our sole discretion, violates this provision.
        </p>

        <h3 className="text-base text-foreground">
          6. Data Storage and Privacy
        </h3>
        <p>
          a. Messages are stored locally on your browser and not on our servers.
        </p>
        <p>
          b. Messages are transiently classified on our servers to prevent abuse
          but are not stored permanently.
        </p>
        <p>
          c. By using the Service, you consent to the processing and temporary
          classification of your messages for these purposes.
        </p>

        <h3 className="text-base text-foreground">7. Termination</h3>
        <p>
          We reserve the right to terminate or suspend your access to the
          Service at our sole discretion, without notice or liability, for any
          reason, including but not limited to, a violation of these Terms.
          Termination may result in the forfeiture and destruction of all
          information associated with your account.
        </p>

        <h3 className="text-base text-foreground">8. Modifications to Terms</h3>
        <p>
          AITherapistFree.com reserves the right to modify these Terms at any
          time. Any changes will be effective immediately upon posting the
          updated Terms on the Website. Your continued use of the Service
          constitutes your acceptance of the revised Terms.
        </p>

        <h3 className="text-base text-foreground">
          9. Governing Law and Jurisdiction
        </h3>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of the jurisdiction in which AITherapistFree.com operates,
          without regard to its conflict of law provisions. You agree to submit
          to the personal and exclusive jurisdiction of the courts located
          within said jurisdiction.
        </p>

        <h3 className="text-base text-foreground">10. Severability</h3>
        <p>
          If any provision of these Terms is found to be invalid or
          unenforceable by a court of competent jurisdiction, the remaining
          provisions will remain in full force and effect.
        </p>

        <h3 className="text-base text-foreground">11. Contact Information</h3>
        <p>
          For any questions regarding these Terms, please contact us here:{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.google.com/forms/d/e/1FAIpQLScDAOGOXyWDaj3JNi21TDsqvoQRL493sdyC2aLpVdFv7gko3A/viewform"
            className="text-sm font-medium text-primary hover:underline"
          >
            Contact Us
          </a>
        </p>
      </div>
    </main>
  );
}

export default Page;

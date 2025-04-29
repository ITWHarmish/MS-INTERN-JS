// PrivacyPolicy.tsx
import styles from './PrivacyPolicy.module.css';

const PrivacyPolicy = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>MS-Intern Privacy Policy</h1>
        
        {/* <div className={styles.dates}>
          <p><strong>Effective Date:</strong> April 29, 2025</p>
          <p><strong>Last Updated:</strong> April 29, 2025</p>
        </div> */}

        <section className={styles.section}>
          <h2>Introduction</h2>
          <p>
            This Privacy Policy explains how MS-Intern collects, uses, and discloses 
            information about you when you use our web-based internship management platform. This Privacy Policy applies 
            to information we collect when you use our website, application, or other online services that link to this 
            Privacy Policy (collectively, the "Services").
          </p>
          <p>
            By accessing or using the Services, you agree to this Privacy Policy. If you do not agree with our policies 
            and practices, do not use our Services.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Developer Information</h2>
          <ul className={styles.infoList}>
            <li><strong>Developer Name:</strong> Harsh Patel</li>
            <li><strong>Support Email:</strong> itw.harshp@gmail.com</li>
            <li><strong>Developer Contact Email:</strong> itw.harshp@gmail.com</li>
            <li><strong>Location:</strong> Surat, Gujarat, India</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Information We Collect</h2>
          <p>We collect several types of information from and about users of our Services:</p>
          
          <h3>Information You Provide to Us</h3>
          <p>When you use our Services, we may collect:</p>
          <ul>
            <li>Account information (name, email address, profile picture)</li>
            <li>Content you submit through the Services (such as task reports, leave applications, feedback)</li>
            <li>Communications you send to us (such as support requests)</li>
          </ul>
          
          <h3>Information We Collect Through Automatic Data Collection Technologies</h3>
          <p>
            We do not use automatic data collection technologies to collect information about your equipment, browsing actions, 
            or patterns, except as necessary for the functioning of our application.
          </p>
          
          <h3>Information We Collect Through Google APIs</h3>
          <p>
            Our application uses Google APIs to provide and improve our Services. We request access to the following Google API scopes:
          </p>
          <ul>
            <li>
              <strong>userinfo.profile:</strong> To access your basic profile information (name, profile picture) for authentication 
              and personalization of the internship management platform.
            </li>
            <li>
              <strong>userinfo.email:</strong> To access your email address for account identification and communication purposes.
            </li>
            <li>
              <strong>chat.messages.create:</strong> To send structured notifications and updates through Google Chat, only when 
              explicitly triggered by user actions.
            </li>
            <li>
              <strong>chat.spaces.readonly:</strong> To identify appropriate spaces where notifications can be delivered.
            </li>
            <li>
              <strong>gmail.send:</strong> To send structured emails like leave applications and automated reports on your behalf, 
              only when explicitly triggered by your actions.
            </li>
            <li>
              <strong>spreadsheets:</strong> To store and manage structured intern logs and performance data in Google Sheets.
            </li>
          </ul>
          <p>
            We limit our data collection to only what is necessary to provide our Services. We will never use your Google account 
            data for advertising, user profiling, or data selling purposes.
          </p>
        </section>

        <section className={styles.section}>
          <h2>How We Use Your Information</h2>
          <p>We use information that we collect about you or that you provide to us:</p>
          <ul>
            <li>To provide, maintain, and improve our Services</li>
            <li>To process and manage your internship tasks, progress reports, and leave applications</li>
            <li>To communicate with you about your account or the Services</li>
            <li>To respond to your inquiries and provide customer support</li>
            <li>To send notifications related to your internship activities (via email or Google Chat)</li>
            <li>To store structured internship logs and performance data in Google Sheets</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Data Retention and Deletion</h2>
          <p>
            We retain your personal information only for as long as necessary to fulfill the purposes for which we collected it, 
            including for the purposes of satisfying any legal, regulatory, tax, accounting, or reporting requirements.
          </p>
          <p>
            You can request deletion of your personal data at any time by contacting us at itw.harshp@gmail.com. Upon receipt 
            of such a request, we will delete your personal information from our systems within 30 days, except where we are legally 
            required to retain certain information.
          </p>
        </section>

        <section className={styles.section}>
          <h2>How to Revoke Access</h2>
          <p>You can revoke MS-Intern's access to your Google account data at any time by:</p>
          <ol>
            <li>Visiting <a href="https://myaccount.google.com/permissions" className={styles.link}>Google Account Settings</a></li>
            <li>Locating MS-Intern in the list of connected applications</li>
            <li>Clicking "Remove Access"</li>
          </ol>
          <p>
            Revoking access will prevent our application from accessing your Google account data, but it may limit your ability 
            to use certain features of our Services.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to maintain the security of your personal information 
            and protect it against unauthorized or unlawful processing, accidental loss, destruction, or damage. However, no method 
            of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee its absolute security.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Sharing Your Information</h2>
          <p>
            We do not share, sell, rent, or trade your personal information with third parties for their commercial purposes. 
            We may share your information in the following circumstances:
          </p>
          <ul>
            <li>With service providers who perform services on our behalf</li>
            <li>To comply with legal obligations</li>
            <li>To protect and defend our rights and property</li>
            <li>With your consent or at your direction</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Children's Privacy</h2>
          <p>
            Our Services are not intended for children under 18 years of age. We do not knowingly collect personal information 
            from children under 18. If you are under 18, do not use or provide any information on our Services. If we learn we 
            have collected personal information from a child under 18, we will delete that information as quickly as possible. 
            If you believe we might have any information from or about a child under 18, please contact us at itw.harshp@gmail.com.
          </p>
        </section>

        <section className={styles.section}>
          <h2>International Data Transfers</h2>
          <p>
            Your information may be transferred to — and maintained on — computers located outside of your state, province, country, 
            or other governmental jurisdiction where the data protection laws may differ from those in your jurisdiction. If you are 
            located outside [Insert Your Country] and choose to provide information to us, please note that we transfer the information 
            to [Insert Your Country] and process it there.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Limited Use Disclosure</h2>
          <p>
            MS-Intern use and transfer of information received from Google APIs to any other app will adhere to 
            <a href="https://developers.google.com/terms/api-services-user-data-policy" className={styles.link}>Google API Services User Data Policy</a>, 
            including the Limited Use requirements.
          </p>
          <p>Specifically:</p>
          <ol>
            <li>We will only use access to read, write, modify, or control Google user data obtained through Google APIs for the purposes described in this Privacy Policy.</li>
            <li>We will not use Google user data for serving advertisements.</li>
            <li>We will not allow humans to read Google user data unless:
              <ul>
                <li>We have your affirmative agreement for specific messages</li>
                <li>It is necessary for security purposes such as investigating abuse</li>
                <li>It is necessary to comply with applicable law</li>
                <li>Our use is limited to internal operations and the data has been aggregated and anonymized</li>
              </ul>
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2>Changes to Our Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. If we make material changes, we will notify you by email 
            (sent to the email address specified in your account) or by means of a notice on our website prior to the change 
            becoming effective. We encourage you to periodically review this page for the latest information on our privacy practices.
          </p>
        </section>

        {/* <section className={styles.section}>
          <h2>Contact Information</h2>
          <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>
          <ul className={styles.contactInfo}>
            <li>Email: your.support@example.com</li>
            <li>Address: [Insert Your Address]</li>
          </ul>
        </section> */}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
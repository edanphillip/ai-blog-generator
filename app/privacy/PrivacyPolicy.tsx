import Markdown from "react-markdown"

const PrivacyPolicy = () => {
   const terms = `# Privacy Policy for Magic AI Articles 

  *Last Updated: 02/04/2024*
  
  1. **Introduction**
  
     Welcome to **Magic AI Articles**! We are committed to protecting the privacy and security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered blog article generation SaaS platform.
  
  2. **Information We Collect**
  
     (a) **User Account Information:** To provide our services, we collect and store information you provide when creating an account, such as your name, email address, and password.
  
     (b) **Usage Data:** We collect information about how you interact with our platform, including the articles generated, editing activities, and other usage patterns.
  
     (c) **Payment Information:** If you subscribe to our premium services, we collect payment information, including credit card details, to process transactions securely.
  
     (d) **Log Data:** Our servers automatically record information, including your IP address, browser type, and the pages you visit.
  
  3. **How We Use Your Information**
  
     We use the collected information for the following purposes:
  
     (a) To provide and improve our services.
     (b) To customize generated content based on your preferences.
     (c) To process transactions and manage user accounts.
     (d) To communicate with you, including updates, promotions, and customer support.
  
  4. **Data Sharing and Disclosure**
  
     (a) **Service Providers:** We may share your information with third-party service providers who assist in delivering our services.
  
     (b) **Legal Compliance:** We may disclose your information to comply with legal obligations or respond to lawful requests from authorities.
  
     (c) **Business Transfers:** In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
  
  5. **Security**
  
     We implement industry-standard security measures to protect your information from unauthorized access, disclosure, alteration, and destruction.
  
  6. **User Control and Choices**
  
     (a) **Account Settings:** You can manage your account settings and preferences to control the information you share.
  
     (b) **Opt-Out:** You can opt-out of promotional communications by following the unsubscribe instructions provided in the messages.
  
  7. **Cookies and Similar Technologies**
  
     We use cookies and similar technologies to enhance user experience, analyze usage patterns, and personalize content.
  
  8. **Children's Privacy**
  
     Our services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children.
  
  9. **Changes to Privacy Policy**
  
     We reserve the right to modify this Privacy Policy at any time. You will be notified of significant changes, and your continued use of our services after such changes constitutes your acceptance of the updated policy.
  
  10. **Contact Us**
  
  Thank you for trusting **Magic AI Articles** with your information!
      If you have questions or concerns about this Privacy Policy or our data practices, please contact us at [support@edanphillip.com](mailto:support@edanphillip.com).
  
  `
   return (
      <div className="marker:text-black px-16 py-4 bg-white prose   prose-a:text-blue-600 *:text-black  prose-strong:text-black">

         <Markdown>
            {terms}
         </Markdown>
      </div>
   )
}

export default PrivacyPolicy
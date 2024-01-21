const PrivacyPolicy = () => {
    return (
        <div className="privacy-policy">
            <h1>Privacy Policy</h1>
            <p>Last Updated: [21/01/2024]</p>

            <section>
                <h2>Introduction</h2>
                <p>
                    Welcome to CleanSlate, a web application dedicated to shedding light on unpaid domestic labor within households.
                    At CleanSlate, we prioritize the privacy and security of your data. This Privacy Policy is designed to inform
                    you about how we collect, use, and protect your personal information. If you have any questions or concerns
                    about this policy, please contact us at <a href="mailto:hello@adakeita.dev">hello@adakeita.dev</a>.
                </p>
            </section>

            <section>
                <h2>Information We Collect</h2>
                <p>We collect the following types of information from our users:</p>
                <ul>
                    <li>Email and User Information: We collect your email address, username, preferred pronoun, and an avatar.
                        This information helps us personalize your CleanSlate experience and connect households together if multiple
                        users register with the same household.</li>
                    <li>Household Information: We collect data related to your household, including the household name
                        (determined by the user), approximate size in square meters (kvm), and the number of rooms. This data is solely
                        used to improve and evolve the application and facilitate connections between households.</li>
                    <li>User-Generated Data: Information you provide through forms on our platform.</li>
                </ul>
            </section>
            <section>
                <h2>Contact Us</h2>
                <p>If you have questions or concerns about this Privacy Policy or your data, please contact us at <a href="mailto:hello@adakeita.dev">hello@adakeita.dev</a>.</p>
            </section>
        </div>
    );
};

export default PrivacyPolicy;

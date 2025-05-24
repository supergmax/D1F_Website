import type { Metadata } from "next"
import Header from "@/components/header"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"

export const metadata: Metadata = {
  title: "Cookie Policy | With Us Associates",
  description: "Our cookie policy explains how we use cookies and similar technologies on our website.",
}

export default function CookiesPage() {
  return (
    <main className="min-h-screen pt-16">
      <Header />

      <PageHeader title="Cookie Policy" description="Last updated: May 12, 2025" />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2 className="text-[#4E463F]">What Are Cookies</h2>
            <p>
              Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored
              in your web browser and allows the website or a third-party to recognize you and make your next visit
              easier and the website more useful to you.
            </p>
            <p>
              Essentially, cookies are a user's identification card for the With Us Associates servers. Web beacons are
              small graphic files linked to our servers that allow us to track your use of our website and related
              functionalities.
            </p>

            <h2 className="text-[#4E463F]">How We Use Cookies</h2>
            <p>
              When you use and access our website, we may place a number of cookies files in your web browser. We use
              cookies for the following purposes:
            </p>
            <ul>
              <li>To enable certain functions of the website</li>
              <li>To provide analytics</li>
              <li>To store your preferences</li>
              <li>To enable advertisements delivery, including behavioral advertising</li>
            </ul>
            <p>
              We use both session and persistent cookies on the website and we use different types of cookies to run the
              website:
            </p>
            <ul>
              <li>
                Essential cookies. We may use essential cookies to authenticate users and prevent fraudulent use of user
                accounts.
              </li>
              <li>
                Preferences cookies. We may use preferences cookies to remember information that changes the way the
                website behaves or looks, such as the "remember me" functionality.
              </li>
              <li>
                Analytics cookies. We may use analytics cookies to track information how the website is used so that we
                can make improvements. We may also use analytics cookies to test new advertisements, pages, features or
                new functionality of the website to see how our users react to them.
              </li>
              <li>
                Advertising cookies. These type of cookies are used to deliver advertisements on and through the website
                and track the performance of these advertisements. These cookies may also be used to enable third-party
                advertising networks to deliver ads that may be relevant to you based upon your activities or interests.
              </li>
            </ul>

            <h2 className="text-[#4E463F]">Third-Party Cookies</h2>
            <p>
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics of
              the website, deliver advertisements on and through the website, and so on.
            </p>

            <h2 className="text-[#4E463F]">What Are Your Choices Regarding Cookies</h2>
            <p>
              If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the
              help pages of your web browser.
            </p>
            <p>
              Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use
              all of the features we offer, you may not be able to store your preferences, and some of our pages might
              not display properly.
            </p>

            <h2 className="text-[#4E463F]">Where Can You Find More Information About Cookies</h2>
            <p>You can learn more about cookies and the following third-party websites:</p>
            <ul>
              <li>
                AllAboutCookies:{" "}
                <a href="http://www.allaboutcookies.org/" className="text-[#4E463F] hover:text-[#CABA9F]">
                  http://www.allaboutcookies.org/
                </a>
              </li>
              <li>
                Network Advertising Initiative:{" "}
                <a href="http://www.networkadvertising.org/" className="text-[#4E463F] hover:text-[#CABA9F]">
                  http://www.networkadvertising.org/
                </a>
              </li>
            </ul>

            <h2 className="text-[#4E463F]">Contact Us</h2>
            <p>If you have questions or comments about this Cookie Policy, please contact us at:</p>
            <p>
              With Us Associates
              <br />
              123 Business Avenue, Suite 500
              <br />
              New York, NY 10001
              <br />
              United States
              <br />
              info@withusassociates.com
              <br />
              +1 (555) 123-4567
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

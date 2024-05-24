import Form from '../components/Form';
import extractErrorMsg from '../utils/extract-error-msg';
import { BASE_URL } from '../config';

export default function BecomeAuthor() {
  return (
    <main className="flex flex-col gap-3">
      <h2>Become an Author</h2>
      <h3 className="mt-3">Why Become an Author?</h3>
      <div className="grid grid-cols-autofill gap-x-6 gap-y-4">
        <div>
          <h4>Join a Vibrant Community</h4>
          <p>
            As an author on our platform, you&apos;ll join a community of
            passionate writers and thinkers. Share your unique insights and
            perspectives with a diverse audience eager to learn and engage.
          </p>
        </div>
        <div>
          <h4>Share Your Expertise</h4>
          <p>
            Have knowledge in a specific field? Our platform gives you the
            opportunity to share your expertise and establish yourself as a
            thought leader. Your posts can inspire, educate, and provoke thought
            among readers worldwide.
          </p>
        </div>
        <div>
          <h4>Grow Your Audience</h4>
          <p>
            Publishing on our platform helps you reach a wider audience. Whether
            you&apos;re writing about technology, lifestyle, arts, or science,
            your content will be accessible to readers who are interested in
            what you have to say.
          </p>
        </div>
        <div>
          <h4>Engage with Readers</h4>
          <p>
            Get direct feedback from your readers through comments and
            interactions. This engagement can help you refine your ideas and
            improve your writing skills.
          </p>
        </div>
        <div>
          <h4>Monetization Opportunities</h4>
          <p>
            As our platform grows, we plan to introduce monetization options for
            our authors. Stay tuned for opportunities to earn from your
            contributions.
          </p>
        </div>
        <div>
          <h4>Flexible and User-Friendly</h4>
          <p>
            Our platform is designed to be user-friendly, making it easy for you
            to draft, edit, and publish your posts. Write at your own pace and
            on your own schedule.
          </p>
        </div>
      </div>
      <h3 className="mt-3">Ready to Get Started?</h3>
      <p>
        Becoming an author is easy. Click the button below to send a
        verification email and get started on your journey as an author. We
        can&apos;t wait to see what you&apos;ll share with our community!
      </p>
      <Form
        btnText="Get verified"
        action={`${BASE_URL}api/verification`}
        method="POST"
        errorExtractor={extractErrorMsg}
        successMsg="Verification email sent!"
        navigateTo="/"
      />
    </main>
  );
}

import CommentWrapper from "@/components/comment/CommentWrapper";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";

function Page() {
  return (
    <>
      <SignedIn>
        <CommentWrapper />
      </SignedIn>
      <SignedOut>
        <div className="p-4 text-center">
          <h3>Please sign in to view this challenge</h3>
          <RedirectToSignIn redirectUrl={"/sign-in"} />
        </div>
      </SignedOut>
    </>
  );
}
export default Page;

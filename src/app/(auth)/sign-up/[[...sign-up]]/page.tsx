import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/20 p-6">
      <SignUp />
    </div>
  );
}


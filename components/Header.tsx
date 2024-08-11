import { Button } from "./ui/button";

function Header() {
  return (
    <header className="mx-auto flex max-w-screen-xl items-center justify-between px-2 py-4 md:px-6 lg:px-12">
      <p className="text-lg">appname</p>
      <div className="flex gap-3">
        <Button>Sign In</Button>
        <Button>Sign Up</Button>
      </div>
    </header>
  );
}

export default Header;

import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container px-4 py-8 md:px-6 lg:py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
          {/* Left side - Logo, Name, Copyright */}
          <div className="flex flex-col space-y-4 lg:max-w-sm">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold">BVRSTR</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A fresh, new collective.
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} BVR STR Collective LLC. All rights
              reserved.
            </p>
          </div>

          {/* Right side - Legal, Company, Social sections */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:gap-12">
            {/* Legal Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/legal/privacy"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/terms"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/cookies"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/return-policy"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Return Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Social</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="https://www.bsky.app/profile/bvrstrco.com"
                    target="_blank"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Bluesky
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.instagram.com/bvrstrco"
                    target="_blank"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.linkedin.com/in/bvrstrco"
                    target="_blank"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.twitter.com/bvrstrco"
                    target="_blank"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Twitter
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

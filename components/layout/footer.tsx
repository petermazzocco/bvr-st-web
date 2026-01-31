import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background ">
      <div className="container px-4 py-8 md:px-6 lg:py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
          {/* Left side - Logo, Name, Copyright */}
          <div className="flex flex-col space-y-4 lg:max-w-sm">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg">BVR ST STUDIO</h2>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} BVR ST STUDIO LLC. All rights
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
                {/*<li>
                  <Link
                    href="/legal/return-policy"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Return Policy
                  </Link>
                </li>*/}
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
                    href="/faq"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    FAQ
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
                    prefetch
                  >
                    Blog
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
              </ul>
            </div>

            {/* Social Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Social</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="https://bsky.app/profile/bvrst.studio"
                    target="_blank"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Bluesky
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/bvr-str"
                    target="_blank"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.instagram.com/bvrststudio"
                    target="_blank"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.linkedin.com/company/bvr-st-studio"
                    target="_blank"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://threads.com/@bvrststudio"
                    target="_blank"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Threads
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

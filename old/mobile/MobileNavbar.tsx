"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
// import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
// import { LogoSvg } from "../LogoSvg";

const NAV_HEIGHT = 72;

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRtl, setIsRtl] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Navbar");

  useEffect(() => {
    setIsRtl(document.body.getAttribute("data-rtl") === "true");
    const observer = new MutationObserver(() => {
      setIsRtl(document.body.getAttribute("data-rtl") === "true");
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-rtl"],
    });
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y =
        el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - 8;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleNav = (sectionId: string) => {
    setIsOpen(false);
    const localePrefix = pathname.split("/")[1];
    const isRoot = pathname === `/${localePrefix}` || pathname === "/";
    if (isRoot) {
      scrollToSection(sectionId);
    } else {
      router.push(`/${localePrefix}?scrollTo=${sectionId}`);
    }
  };

  const handleRouteClick = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  const handleClickHome = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    const localePrefix = pathname.split("/")[1];
    const isRoot = pathname === `/${localePrefix}` || pathname === "/";
    if (isRoot) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push(`/${localePrefix}`);
    }
  };

  // Determine locale from pathname
  const localePrefix = pathname.split("/")[1];
  const isArabic = localePrefix === "ar";

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="flex justify-center items-center">
        <Menu className="text-[48px] text-primary" />
      </SheetTrigger>
      <SheetContent
        className="flex flex-col"
        side={isArabic ? "left" : "right"}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

        {/* <div className="pl-3 pt-3">
          <Link href="/">
            <span className="text-primary">
              <LogoSvg />
            </span>
          </Link>
        </div> */}
        <div className="mt-32 mb-40 text-center text-2xl">
          <nav className="flex flex-col justify-center items-center gap-8">
            <button
              onClick={handleClickHome}
              className="text-xl hover:text-accent-hover transition-all"
            >
              {t("home")}
            </button>
            <button
              onClick={() => handleNav("mission")}
              className="text-xl hover:text-accent-hover transition-all"
            >
              {t("mission")}
            </button>
            <button
              onClick={() => handleNav("projects")}
              className="text-xl hover:text-accent-hover transition-all"
            >
              {t("projects")}
            </button>
            <button
              onClick={() => handleNav("approach")}
              className="text-xl hover:text-accent-hover transition-all"
            >
              {t("approach")}
            </button>
            <button
              onClick={() => handleRouteClick("/about")}
              className="text-xl hover:text-accent-hover transition-all"
            >
              {t("about")}
            </button>
            <Button
              onClick={() => handleRouteClick("/contact")}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {t("contact")}
            </Button>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;

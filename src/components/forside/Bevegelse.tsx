"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

// Bevegelsene som går over hele forsiden: myk rulling (Lenis – den eneste
// rullemotoren), overskrifter ord for ord, innslide av grupper, menyfargen og
// lampelyset i avslutningen. Med «redusert bevegelse» står alt i sluttilstand
// og rullingen er nettleserens egen. Heroen og grafikken styrer seg selv.

export function Bevegelse() {
  useEffect(() => {
    const rot = document.querySelector<HTMLElement>("[data-forside]");
    const meny = document.querySelector<HTMLElement>(".fs-meny");
    if (!rot || !meny) return;
    const mm = gsap.matchMedia();
    let lenis: Lenis | null = null;

    const ctx = gsap.context(() => {
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95 });
        const l = lenis;
        l.on("scroll", ScrollTrigger.update);
        const raf = (tid: number) => l.raf(tid * 1000);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);

        gsap.utils.toArray<HTMLElement>("[data-ord]", rot).forEach((h) => {
          gsap.from(h.querySelectorAll(".ord"), {
            yPercent: 140,
            duration: 1,
            ease: "power4.out",
            stagger: 0.05,
            scrollTrigger: { trigger: h, start: "top 86%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-vis-gruppe]", rot).forEach((g) => {
          gsap.from(g.querySelectorAll("[data-vis]"), {
            y: 28,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: g, start: "top 84%", once: true },
          });
        });

        // Lampelyset i avslutningen følger musa, litt etter.
        const cta = rot.querySelector<HTMLElement>("[data-lampelys]");
        const glod = cta?.querySelector<HTMLElement>("[data-glod]");
        let flyttGlod: ((e: PointerEvent) => void) | undefined;
        if (cta && glod) {
          const tilX = gsap.quickTo(glod, "x", { duration: 0.8, ease: "power3.out" });
          const tilY = gsap.quickTo(glod, "y", { duration: 0.8, ease: "power3.out" });
          flyttGlod = (e: PointerEvent) => {
            if (e.pointerType === "touch") return;
            const b = cta.getBoundingClientRect();
            tilX(e.clientX - b.left - b.width / 2);
            tilY(e.clientY - b.top - b.height / 2);
          };
          cta.addEventListener("pointermove", flyttGlod);

          // Berøringsskjermer har ingen mus å følge: der driver gløden sakte
          // fram og tilbake mens avslutningen er synlig.
          if (window.matchMedia("(hover: none)").matches) {
            const drift = gsap
              .timeline({ repeat: -1, yoyo: true, paused: true, defaults: { duration: 4.5, ease: "sine.inOut" } })
              .to(glod, { x: () => cta.offsetWidth * 0.2, y: () => -cta.offsetHeight * 0.12 })
              .to(glod, { x: () => -cta.offsetWidth * 0.18, y: () => cta.offsetHeight * 0.1 });
            ScrollTrigger.create({
              trigger: cta,
              start: "top bottom",
              end: "bottom top",
              onToggle: (st) => (st.isActive ? drift.play() : drift.pause()),
            });
          }
        }

        return () => {
          if (cta && flyttGlod) cta.removeEventListener("pointermove", flyttGlod);
          gsap.ticker.remove(raf);
          gsap.ticker.lagSmoothing(500, 33);
          l.destroy();
          lenis = null;
        };
      });

      // Menyen: gjennomsiktig helt øverst, ellers farget etter flaten under.
      const settTopp = (y: number) => (meny.dataset.topp = String(y < 12));
      ScrollTrigger.create({ start: 0, end: "max", onUpdate: (st) => settTopp(st.scroll()) });
      settTopp(window.scrollY);
      gsap.utils.toArray<HTMLElement>("[data-flate='dag']", rot).forEach((flate) => {
        ScrollTrigger.create({
          trigger: flate,
          start: "top 40px",
          end: "bottom 40px",
          onToggle: (st) => (meny.dataset.flate = st.isActive ? "dag" : "natt"),
        });
      });
    }, rot);

    // Lenker til steder på siden: rull mykt dit og flytt fokus, så tastatur og
    // skjermleser også havner riktig.
    const onKlikk = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href^='#']");
      const id = a?.getAttribute("href")?.slice(1);
      const mal = id ? document.getElementById(id) : null;
      if (!a || !mal || !lenis) return;
      e.preventDefault();
      lenis.scrollTo(mal, { offset: id === "innhold" ? 0 : -24 });
      if (!mal.hasAttribute("tabindex")) mal.setAttribute("tabindex", "-1");
      mal.focus({ preventScroll: true });
      history.replaceState(null, "", `#${id}`);
    };
    document.addEventListener("click", onKlikk);

    const oppdater = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(oppdater);
    window.addEventListener("load", oppdater);

    return () => {
      document.removeEventListener("click", onKlikk);
      window.removeEventListener("load", oppdater);
      ctx.revert();
      mm.revert();
    };
  }, []);

  return null;
}

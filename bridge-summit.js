gsap.registerPlugin(ScrollTrigger);
console.log("WRT")

function scramble() {
  const scrambleDate = document.querySelectorAll(".bge24-header_date");
  const scrambleMonth = document.querySelectorAll(".bge24-header_month");
  const scrambleYear = document.querySelectorAll(".bge24-header_year");
  const scrambleTL = gsap.timeline();

  // GSAP Scramble Effect
  scrambleTL
    .to(scrambleDate, {
      duration: 2,
      stagger: 0.2,
      scrambleText: {
        speed: 0.7,
        text: "{original}",
        chars: "0123456789", // Only numbers for the date
      },
    })
    .to(
      scrambleMonth,
      {
        duration: 2,
        stagger: 0.2,
        scrambleText: {
          speed: 0.7,
          text: "{original}",
          chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", // Only letters for the month
        },
      },
      0
    )
    .to(
      scrambleYear,
      {
        duration: 2,
        stagger: 0.2,
        scrambleText: {
          speed: 0.7,
          text: "{original}",
          chars: "0123456789", // Only numbers for the year
        },
      },
      0
    );
}

function agendaItems() {
  $(".bge24-agenda_item").each(function () {
    const $this = $(this);
    const $bottomWrapper = $this.find(".bge24-agenda_item-bottom-wrapper");
    const $top = $this.find(".bge24-agenda_item-top");
    const $label = $this.find(".bge24-agenda_item-label");
    const $plusIcon = $this.find(".bge24-agenda_plus-icon");
    const $line = $this.find(".bge24-agenda_line");

    const agendaTl = gsap.timeline({
      paused: true,
      defaults: { duration: 0.5, ease: "power2.inOut" },
    });

    agendaTl
      .to($bottomWrapper, {
        height: "auto",
        // ease: "power3.inOut",
        duration: 0.7,
      })
      .to($top, { backgroundColor: "#754CFF", duration: 0.3 }, 0)
      .to($label, { color: "#fff" }, 0)
      .to($plusIcon, { rotate: 45 }, 0)
      .to($line, { backgroundColor: "#754CFF", duration: 0.3 });

    // Inside your $top.on("click", ...) handler
    $top.on("click", function () {
      const $currentItem = $(this).closest(".bge24-agenda_item");
      const $activeSiblings = $currentItem.siblings(
        ".bge24-agenda_item.is-active"
      );

      if ($currentItem.hasClass("is-active")) {
        agendaTl.timeScale(1.2).reverse();
        $currentItem.removeClass("is-active");
      } else {
        agendaTl.timeScale(1).restart();
        $currentItem.addClass("is-active");

        // Trigger click on active siblings
        $activeSiblings.each(function () {
          $(this).find(".bge24-agenda_item-top").trigger("click");
        });
      }
    });

    //Scroll Trigger
    gsap.set(".bge24-agenda_item-top", { opacity: 0 });

    ScrollTrigger.create({
      trigger: ".section_bge24-agenda",
      start: "top center",
      onEnter: () => {
        gsap.to(".bge24-agenda_item-top", {
          opacity: 1,
          ease: "power2.out",
          stagger: { amount: 0.7 },
        });
      },
    });
  });
}

function speakerItemsDesktop() {
  //Speaker Click Interaction
  $(".bge24-speakers_item").each(function () {
    const $this = $(this);
    const $top = $this.find(".bge24-speaker_item-top");
    const $heading = $this.find(".bge24-speaker_item-heading");
    const $jobTitle = $this.find(".bge24-speaker_job-title");
    const $line = $this.find(".bge24-speakers_line");

    const speakerTl = gsap.timeline({
      paused: true,
      defaults: { duration: 0.3, ease: "power1.out" },
    });

    speakerTl
      .to($top, { backgroundColor: "#fff" })
      .to($heading, { color: "#000" }, 0)
      .to($jobTitle, { color: "#666666" }, 0)
      .to($line, { opacity: 0 }, 0);

    $this.on("mouseenter", function () {
      speakerTl.timeScale(1).restart();
    });

    $this.on("mouseleave", function () {
      speakerTl.timeScale(1.5).reverse();
    });
  });
}

function speakerItemsMobile() {
  // Speaker Click Interaction
  $(".bge24-speakers_item").each(function () {
    const $this = $(this);
    const $bottomWrapper = $this.find(".bge24-speaker_item-bottom-wrapper");
    const $top = $this.find(".bge24-speaker_item-top");
    const $heading = $this.find(".bge24-speaker_item-heading");
    const $jobTitle = $this.find(".bge24-speaker_job-title");
    const $line = $this.find(".bge24-speakers_line");
    const $chevron = $this.find(".bge24-speaker_chevron");

    // Create a GSAP timeline for each speaker item
    const speakerTl = gsap.timeline({
      paused: true,
      defaults: { duration: 0.3, ease: "power1.out" },
    });

    gsap.set($bottomWrapper, { height: 0, display: "flex" });

    speakerTl
      .fromTo(
        $bottomWrapper,
        { height: 0, opacity: 0 },
        {
          height: "auto",
          opacity: 1,
          duration: 0.5,
        },
        0
      )
      .to($top, { backgroundColor: "#fff" }, 0)
      .to($heading, { color: "#000" }, 0)
      .to($chevron, { color: "#000", opacity: 1, rotate: -180 }, 0)
      .to($jobTitle, { color: "#666666" }, 0)
      .to($line, { opacity: 0 }, 0);

    // Click event for each top element
    $top.on("click", function () {
      const $currentItem = $(this).closest(".bge24-speakers_item");
      const $activeSiblings = $currentItem.siblings(
        ".bge24-speakers_item.is-active"
      );

      if ($currentItem.hasClass("is-active")) {
        speakerTl.timeScale(1.2).reverse();
        $currentItem.removeClass("is-active");
      } else {
        speakerTl.timeScale(1).restart();
        $currentItem.addClass("is-active");

        // Trigger click on active siblings
        $activeSiblings.each(function () {
          $(this).find(".bge24-speaker_item-top").trigger("click");
        });
      }
    });
  });
}

function agendaLines() {
  //Agenda Lines Animator
  let agendaLine = gsap.timeline({
    scrollTrigger: {
      trigger: ".section_bge24-agenda",
      start: "top center",
      scrub: false,
    },
  });
  agendaLine.fromTo(
    ".bge24-agenda_line",
    { width: "0%" },
    {
      width: "100%",
      duration: 0.8,
      ease: "power1.out",
      stagger: { amount: 1 },
    }
  );
}

function speakerLines() {
  let $speakerSectionTrigger = ".section_bge24-speakers";
  // Speaker Lines Animator for horizontal & vertical lines
  let speakerLineInfo = gsap.timeline({
    scrollTrigger: {
      trigger: $speakerSectionTrigger,
      start: "top bottom",
      end: "top 15%",
      scrub: false,
    },
  });
  speakerLineInfo.fromTo(
    ".bge24-speakers_line.is-info",
    { width: "0%" },
    {
      width: "100%",
      duration: 0.8,
      ease: "power1.out",
    }
  );

  // Speaker Lines Animator for item lines
  let speakerLineItem = gsap.timeline({
    scrollTrigger: {
      trigger: $speakerSectionTrigger,
      start: "top center",
      scrub: false,
    },
  });
  speakerLineItem
    .fromTo(
      ".bge24-speakers_line.is-item",
      { width: "0%" },
      {
        width: "100%",
        duration: 0.8,
        ease: "power2.out",
        stagger: { amount: 1 },
      }
    )
    .fromTo(
      ".bge24-speakers_line.is-vertical",
      { height: "0%" },
      {
        height: "100%",
        duration: 0.8,
        ease: "power1.out",
      },
      0.5
    );
}

function textAnimations() {
  // Split text into spans
  let typeSplit = new SplitType("[text-split]", {
    types: "words, chars, lines",
    tagName: "span",
  });

  let scrambleSplit = new SplitType("[scramble-slide-up]", {
    types: "words, lines, chars",
    tagName: "span",
  });

  function createScrollTrigger(triggerElement, timeline) {
    let hasPlayed = false; // Flag to track if the animation has played

    // // Reset tl when scroll out of view past bottom of screen
    // ScrollTrigger.create({
    //   trigger: triggerElement,
    //   start: "top bottom",
    //   onLeaveBack: () => {
    //     timeline.progress(0);
    //     timeline.pause();
    //     hasPlayed = false; // Reset flag when scrolled back
    //   },
    // });

    // Play tl when scrolled into view (60% from top of screen)
    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top 60%",
      onEnter: () => {
        if (!hasPlayed) {
          timeline.play();
          hasPlayed = true; // Set flag to true after playing
        }
      },
    });
  }
  $("[words-slide-up]").each(function (index) {
    let tl = gsap.timeline({ paused: true });
    tl.fromTo(
      $(this).find(".char"),
      { opacity: 0, yPercent: 100 },
      {
        opacity: 1,
        yPercent: 0,
        duration: 0.4,
        ease: "power2.out",
        stagger: { amount: 0.2 },
      }
    );
    createScrollTrigger($(this), tl);
  });

  $("[scrub-each-word]").each(function (index) {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: $(this),
        start: "top 70%",
        end: "top center",
        scrub: 1,
      },
    });

    tl.from($(this).find(".char"), {
      opacity: 0.2,
      duration: 0.2,
      ease: "power2.out",
      stagger: { each: 0.4 },
    });
  });
}

function pageload() {
  let $headerBG = $(".bge24-header_bg-wrapper");
  let $headerSection = $(".section_bge24-header");
  let headerLoadTl = gsap.timeline({
    defaults: {
      ease: "power2.out",
    },
  });

  headerLoadTl
    .set(".bge24-header_date-n-time .char", { opacity: 1 })
    .call(scramble)
    .fromTo(
      ".bge24-header_date-n-time .char",
      { yPercent: 100 },
      {
        yPercent: 0,
        duration: 0.7,
        // delay: 0.1,
        ease: "power2.out",
        stagger: { amount: 0.35 },
      },
      "<0.4"
    )
    .fromTo(
      $headerBG,
      { yPercent: -50, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1.5 },
      0
    )
    .fromTo(".bge24-header_content-top", { opacity: 0 }, { opacity: 1 }, 0)
    .fromTo(
      $(".bge24-header_heading").find(".char"),
      { opacity: 0, yPercent: 100 },
      {
        opacity: 1,
        yPercent: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: { amount: 0.3 },
      },
      0
    )
    .fromTo(
      ".bge24-header_button",
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
        delay: 1,
      },
      0
    )
    .fromTo(
      "[bge24-nav]",
      { y: "-1rem", opacity: 0 },
      {
        y: "0rem",
        opacity: 1,
        duration: 0.6,
        delay: 0.8,
      },
      0
    );

  //  Header image opacity to 0 on scroll
  let headerTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".section_bge24-agenda",
      start: "top 80%",
      end: "top 30%",
      // endTrigger: ".section_bge24-agenda",
      //   toggleActions: "play complete reverse none",
      scrub: true,
    },
  });

  headerTl.to($headerBG, { opacity: 0, duration: 0.4, ease: "power1.out" });

  ScrollTrigger.create({
    trigger: ".bge24_navbar-trigger",
    start: "top top",
    end: "bottom top",
    onLeave: () => {
      $(".bge24-navbar_component").removeClass("is-transparent");
    },
    onEnterBack: () => {
      $(".bge24-navbar_component").addClass("is-transparent");
    },
  });

  $("[bge24-text-style-border]").each(function (index) {
    let bge24brdr = gsap.timeline({
      scrollTrigger: {
        trigger: $(this),
        start: "top 65%",
        end: "top center",
        scrub: 1,
      },
    });

    bge24brdr.fromTo(
      $(this).find(".bge24-header_link"),
      { borderBottomColor: "rgba(255, 255, 255, 0.2)" },
      {
        borderBottomColor: "rgba(255, 255, 255, )",
        duration: 0.2,
        ease: "power2.out",
      }
    );
  });
}

function faqListLoad() {
  gsap.set(".faq1_accordion", {
    opacity: 0,
    scale: 1.02,
  });

  ScrollTrigger.create({
    trigger: "[faq-list]",
    start: "top 70%",
    onEnter: () => {
      gsap.to(".faq1_accordion", {
        opacity: 1,
        y: "0rem",
        // scale: 1,
        delay: 0.2,
        duration: 1,
        ease: "power2.out",
        stagger: {
          amount: 0.8,
        },
      });
    },
  });
}

function footerVisibility() {
  // gsap scroll trigger
  let footerVisibilityTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".section_bge24-contact",
      start: "top top",
      end: "bottom bottom",
      // toggleActions: "play none none none",
      scrub: true,
    },
  });

  footerVisibilityTl
    .fromTo(
      ".bge24-footer_component",
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.1,
        ease: "power1.out",
      }
    )
    .to(".bge24-header_bg", { opacity: 0 });
}

function formLoad() {
  let formLoadTl = gsap.timeline({
    scrollTrigger: { trigger: ".bge24-contact_component" },
    start: "top center",
    end: "bottom top",
    toggleActions: "play none none none",
    scrub: false,
  });

  formLoadTl.fromTo(
    ".bge24-contact_form-wrapper",
    { opacity: 0, y: "2rem" },
    {
      opacity: 1,
      y: "0rem",
      delay: 0.5,
      duration: 0.6,
      ease: "power2.out",
    }
  );
}

function speakerDesktopSticky() {
  document.querySelectorAll(".bge24-speakers_item").forEach((speakerItem) => {
    speakerItem.addEventListener("click", function () {
      toggleStickyItems(this);
    });

    speakerItem.addEventListener("mouseenter", function () {
      toggleStickyItems(this);
    });
  });

  // Adding mouse leave event listener to the speakers block
  document.querySelectorAll(".bge24-speakers_block").forEach((block) => {
    block.addEventListener("mouseleave", function () {
      hideAllStickyItems();
    });
  });

  function toggleStickyItems(clickedItem) {
    hideAllStickyItems();

    const roleValue = clickedItem.getAttribute("data-element-role");
    const matchingStickyItem = document.querySelector(
      `.bge24-speaker_item-bottom-sticky[data-element-role="${roleValue}"]`
    );

    if (matchingStickyItem) {
      matchingStickyItem.style.display = "block";
    }
  }

  function hideAllStickyItems() {
    document
      .querySelectorAll(".bge24-speaker_item-bottom-sticky")
      .forEach((stickyItem) => {
        stickyItem.style.display = "none";
      });
  }

  //Scroll Trigger
  gsap.set(".bge24-speakers_item", { opacity: 0 });

  ScrollTrigger.create({
    trigger: ".bge24-speakers_block",
    start: "top center",
    onEnter: () => {
      gsap.to(".bge24-speakers_item", {
        opacity: 1,
        ease: "power2.out",
        stagger: { amount: 1 },
      });
    },
  });
}

agendaLines();
agendaItems();
speakerLines();
textAnimations();
pageload();
footerVisibility();
faqListLoad();
formLoad();
speakerDesktopSticky();

let mm = gsap.matchMedia();
// on desktop
mm.add("(min-width: 992px)", () => {
  speakerItemsDesktop();
});
// on tablet and below
mm.add("(max-width: 991px)", () => {
  speakerItemsMobile();
});

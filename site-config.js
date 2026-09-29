// Set paperUrl to the paper's https://arxiv.org/abs/... URL when available.
const projectLinks = Object.freeze({ paperUrl: "" });
if (projectLinks.paperUrl) {
  document.querySelectorAll("[data-paper-link]").forEach(link => {
    link.href = projectLinks.paperUrl;
    link.target = "_blank";
    link.rel = "noopener";
  });
  document.getElementById("paper").textContent = "Paper available on arXiv.";
} else {
  document.querySelectorAll("[data-paper-link]").forEach(link => {
    link.removeAttribute("target");
    link.setAttribute("aria-label", "Paper — arXiv link coming soon");
  });
}

// Carica il player di YouTube soltanto dopo un'azione esplicita del lettore.
// Se JavaScript non è disponibile, il collegamento continua ad aprire YouTube.
document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const link = target.closest(".video-yt a");
  if (!link) return;
  const box = link.closest(".video-yt");
  const id = box?.dataset.id;
  if (!/^[\w-]{11}$/.test(id || "")) return;
  if (link.href !== "https://www.youtube.com/watch?v=" + id) return;
  event.preventDefault();
  const frame = document.createElement("iframe");
  frame.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
  frame.title = box.dataset.titolo || "Video YouTube";
  frame.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share";
  frame.referrerPolicy = "strict-origin-when-cross-origin";
  frame.allowFullscreen = true;
  frame.setAttribute("loading", "lazy");
  box.replaceChildren(frame);
});

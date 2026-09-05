/* ==========================================================================
   Google Analytics (GA4) do site.

   Uma linha por página, no <head>:
     <script defer src="assets/analytics.js"></script>          (raiz)
     <script defer src="../../assets/analytics.js"></script>    (dentro de uma ferramenta)

   O ID de medição mora só aqui — trocar de propriedade é mexer em um lugar.
   Aberto do disco (file://) não mede nada: a requisição falharia de qualquer
   forma e as ferramentas precisam funcionar offline.
   ========================================================================== */
(function () {
  var ID = "G-JK9WGDD6CQ";
  if (location.protocol === "file:") return;

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  gtag("js", new Date());
  gtag("config", ID);
})();

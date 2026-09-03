HONVAX Website V3 - deployment notes
====================================

1. Upload the CONTENTS of this folder to the current web root, replacing the existing HTML/CSS/JS files.
2. The Power & Energy hero uses assets/img/industry-power-energy.webp generated from the supplied industry-power-energy artwork.
3. Header/footer navigation is unified: Industries / Services / Products & Equipment / Send Your RFQ.
4. About content is merged into Home. about.html and how-we-work.html are retained only as fallback redirect pages.
5. .htaccess contains 301 redirects for Apache hosting. _redirects contains the same rules for Netlify. If your host uses another redirect system, configure the equivalent rules there.
6. RFQ FORM: send-your-rfq.html is preconfigured to use FormSubmit (https://formsubmit.co/info@honvax.com) so a static site can receive form submissions and one attachment without a server. The first live submission requires email activation/confirmation by the recipient. FormSubmit is a third-party processor; because HONVAX RFQs can contain commercially sensitive information, replace this endpoint with your existing/private backend before deployment if your confidentiality policy requires first-party or specifically contracted processing. If replacing it, change only the <form action=...> value and preserve the field names unless your backend requires otherwise.
7. File uploads: the default form accepts one attachment and FormSubmit documents a 10 MB total file-size limit. The page tells users to email multiple/large files to info@honvax.com.
8. Privacy and Terms are concise website drafts. They should be reviewed against your actual hosting, analytics, cookies, form provider and company legal requirements before relying on them as legal documents.
9. No external CSS/JS libraries are required. The site uses system fonts and self-contained assets for faster loading.
10. Before going live, test: mobile navigation, every CTA, the RFQ form, redirect rules, privacy/terms, and the 404 page.

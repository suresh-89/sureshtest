/**
 * To initialize tawk.to chat widget.
 */
export function TawkTo() {
    if (!document.getElementById("tawk-to-react")) {
        try {
            // eslint-disable-next-line no-use-before-define
            var Tawk_API = Tawk_API || {},
                // eslint-disable-next-line no-unused-vars
                Tawk_LoadStart = new Date();
            (function () {
                var s1 = document.createElement("script"),
                    s0 = document.getElementsByTagName("script")[0];
                s1.async = true;
                s1.src = `https://embed.tawk.to/${process.env.REACT_APP_TAWK_TO_API_KEY}/1fa5g1ui2`;
                s1.charset = "UTF-8";
                s1.id = "tawk-to-react";
                s1.setAttribute("crossorigin", "*");
                s0.parentNode.insertBefore(s1, s0);
            })();
        } catch (error) {
            console.warn(error);
        }
    }
}

/**
 * To toggle tawk.to chat widget
 */
export function ToggleTawkTo(status) {
    // get all the top level children of the body tag
    var body = document.body.children;

    if (body) {
        // loop through each node
        body.forEach((node) => {
            // get iframe from each node
            var iframe = node.getElementsByTagName("iframe");

            // check if the node has iframe
            if (iframe && iframe.length >= 3) {
                // loop through each iframe to check whether it is a tawk-to iframe
                iframe.forEach((frame) => {
                    var element =
                        frame.contentWindow.document.body.getElementsByClassName(
                            "tawk-min-container"
                        );

                    // if it is a tawk-to iframe, then toggle the parent node
                    if (element && element.length !== 0) {
                        node.style.cssText =
                            status === "show"
                                ? "display:block !important"
                                : "display:none !important";
                    }
                });
            }
        });
    }
}

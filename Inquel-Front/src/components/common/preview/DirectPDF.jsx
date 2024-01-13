import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const DirectPDF = ({ file_url }) => {
    const [page_number, setPageNumber] = useState(1);
    const [total_pages, setTotalPages] = useState(null);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setTotalPages(numPages);
    };

    const goToPrevPage = () => setPageNumber(page_number - 1);
    const goToNextPage = () => setPageNumber(page_number + 1);

    return (
        <>
            {/* ----- File displaying ----- */}
            <div id="ResumeContainer py-3">
                <Document
                    file={file_url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className={"PDFDocument"}
                >
                    <Page
                        pageNumber={page_number}
                        className={"PDFPage shadow"}
                    />
                </Document>
            </div>

            {total_pages > 1 && (
                <>
                    <p className="my-3">
                        Page {page_number} of {total_pages}
                    </p>
                    <nav>
                        <button
                            className="btn btn-primary btn-sm shadow-none mr-2"
                            onClick={goToPrevPage}
                            disabled={page_number === 1 ? true : false}
                        >
                            Prev
                        </button>
                        <button
                            className="btn btn-primary btn-sm shadow-none"
                            onClick={goToNextPage}
                            disabled={
                                total_pages === page_number ? true : false
                            }
                        >
                            Next
                        </button>
                    </nav>
                </>
            )}
        </>
    );
};

export default DirectPDF;

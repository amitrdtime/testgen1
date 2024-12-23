import React, { useState, useEffect } from "react";
import { Image } from "semantic-ui-react";
import Draggable from "react-draggable";

const DocUploadStatusModal = ({ documents, onClose }) => {
  const [docStatus, setdocStatus] = useState([]);
  useEffect(() => {
    setdocStatus(documents);
  }, [documents]);

  const handleClose = () => {
    onClose();
  };

  return (
    <Draggable>
      <div className="uploadingBox" style={styles.container}>
        <div className="uploadingBoxHead" style={styles.section}>
          <div className="flexAli">
            <Image src="/images/uploadFile.svg" alt="Upload" />
            <p>Uploading</p>
          </div>
          <div className="flexAli closeArrow">
            <div>
              <Image src="/images/grey-chevron.svg" alt="Upload" />
            </div>
            <div onClick={handleClose}>
              <Image src="/images/upload-black-close.svg" alt="collapse" />
            </div>
          </div>
        </div>

        {docStatus.map((item, index) => (
          <div key={index}>
            <div 
              style={{ ...styles.section, marginTop: "15px", padding: "5px 16px" }}
            >
              <div >
                <p>
                  {item.documentName.length > 15
                    ? item.documentName.slice(0, 15) + "..."
                    : item.documentName}
                </p>
              </div>
              <div>
                {item.status === 0 && (
                  <Image src="/images/upload-blue-loader.png" alt="Upload" />
                )}

                {item.status === 1 && (
                  <Image src="/images/upload-green-tick.svg" alt="Upload" />
                )}

                {item.status === 2 && (
                  <Image src="/images/upload-error.svg" alt="Upload" />
                )}
              </div>
            </div>
            {item.error && (
              <div className="uploadingErrorBox" style={styles.subSection}>
                <p>{item.error}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </Draggable>
  );
};

const styles = {
  container: {
    position: "absolute",
    bottom: "90px",
    right: "25px",
    background: "#ffffff",
    width: "250px",
    padding: "5px",
    zIndex: "1",
  },
  section: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "5px",
  },
  subSection: {
    marginLeft: "6px",
    marginTop: "15px",
    background: "#FFEBEE",
    borderRadius: "10px",
    padding: "5px",
  },
};

export default DocUploadStatusModal;

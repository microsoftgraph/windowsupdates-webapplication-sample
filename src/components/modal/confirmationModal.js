import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import SpinnerCommon from "../SpinnerCommon";
import { useState } from "react";
import { removeDeviceFromService } from "../../api/removeDeviceFromService";

const ConfirmModal = ({
  isOpen,
  toggleModal,
  deviceId,
  policyId,
  messageToDisplay,
  refreshPolicy,
}) => {
  const [showSpinner, setShowSpinner] = useState(false);

  return (
    <>
      {showSpinner ? (
        <SpinnerCommon />
      ) : (
        <Modal
          show={isOpen}
          onHide={toggleModal}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          size="sm"
        >
          <Modal.Header closeButton>
            <Modal.Title>Are you sure? Please confirm.</Modal.Title>
          </Modal.Header>
          <Modal.Body>{messageToDisplay}</Modal.Body>
          <Modal.Footer>
            <Button
              className="btn btn-dark"
              onClick={async () => {
                setShowSpinner(true);
                await removeDeviceFromService(deviceId);
                setShowSpinner(false);
                toggleModal();
                await refreshPolicy(policyId);
              }}
            >
              Confirm
            </Button>
            <button
              className="btn btn-dark"
              onClick={() => {
                toggleModal();
              }}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default ConfirmModal;

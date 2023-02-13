import React, { useState } from "react";
import PropTypes from "prop-types";
import { deletePolicy } from "../../api/deletePolicy";
import SpinnerCommon from "../SpinnerCommon";
import { Modal } from "react-bootstrap";

function DeleteModal(props) {
  const { policyId, isDeleteModalOpen, toggleModal, refreshPolicyData } = props;
  const [spinner, setSpinner] = useState(false);

  return (
    <>
      {spinner ? <SpinnerCommon /> : null}
      <Modal
        show={isDeleteModalOpen}
        backdrop="static"
        onHide={toggleModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Policy?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this policy? This cannot be undone.
          <br />
          <br />
          {policyId}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-dark" onClick={toggleModal}>
            Cancel
          </button>
          <button
            className="btn btn-dark"
            onClick={async () => {
              setSpinner(true);
              await deletePolicy(policyId);
              setSpinner(false);
              toggleModal();
              await refreshPolicyData();
            }}
          >
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

DeleteModal.propTypes = {};

export default DeleteModal;

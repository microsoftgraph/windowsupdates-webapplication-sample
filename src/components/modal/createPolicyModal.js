import { Form, Button, Spinner } from "react-bootstrap";
import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import "./modalWindow.css";
import SpinnerCommon from "../SpinnerCommon";
import EditPolicyModal from "./editPolicyModel";
// TODO: Need to change look and feel of modal window

const CreatePolicyModal = (props) => {
  let policyType = "manual";
  let policyName = "";

  const { isModelWindowOpen, handleCreatePolicy, toggleModal, spinner } = props;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPolicyToDelete, setSelectedPolicyToDelete] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState([]);

  return (
    <>
      {spinner ? <SpinnerCommon /> : null}
      <Modal
        show={isModelWindowOpen}
        backdrop="static"
        onHide={toggleModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Policy</Modal.Title>
        </Modal.Header>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreatePolicy(policyName, policyType);
          }}
        >
          <Modal.Body>
            <Form.Check
              type="radio"
              label="Automatic"
              id="automatic"
              value="automatic"
              name="group1"
              onChange={(event) => {
                policyType = event.target.value;
              }}
            />
            <Form.Check
              type="radio"
              label="Manual"
              id="manual"
              value="manual"
              name="group1"
              defaultChecked
              onChange={(event) => {
                policyType = event.target.value;
              }}
            />
            <label style={{ fontWeight: "bold" }}>
              Policy Name :&nbsp;
              <input
                type="text"
                onChange={(event) => {
                  policyName = event.target.value;
                }}
              />
            </label>
          </Modal.Body>

          <Modal.Footer>
            <Button type="submit" className="btn btn-dark">
              Create
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default CreatePolicyModal;

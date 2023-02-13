import "./modalWindow.css";

import { AiFillMinusCircle } from "react-icons/ai";

import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";

import { useEffect, useRef, useState } from "react";
import { BsFillPlusCircleFill } from "react-icons/bs"; //MIT LICENSE < https://github.com/twbs/icons >
import { FaFileUpload, FaRegEdit, FaRegSave } from "react-icons/fa";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateDeploymentAudience } from "../../api/updateDeploymentAuidence";
import SpinnerCommon from "../SpinnerCommon";
import { entityType } from "../../config/Constants";
import MemberTable from "../table/memberTable";
import { gridColumnVisibilityModelSelector } from "@mui/x-data-grid";

const EditPolicyModal = (props) => {
  let policyType = "manual";
  let policyName = "";
  const [spinner, setSpinner] = useState(false);
  const [showEditPolicyName, setShowEditPolicyName] = useState(false);
  const [fileChosen, setFileChosen] = useState(false);
  const [selectedPolicyName, setSelectedPolicyName] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [batchMembers, setBatchMembers] = useState("");
  const [batchMembersRemove, setBatchMembersRemove] = useState("");
  const [policyToEdit, setPolicyToEdit] = useState([]);

  const fileInput = useRef(null);
  const {
    policies,
    isModelWindowOpen,
    onSubmit,
    toggleModal,
    policyToEditId,
    audienceId,
    refreshPolicy,
    policyToMembers,
  } = props;

  function csvJSON(csv) {
    const lines = csv.split(`\r\n`);
    const result = [];
    const headers = lines[0].split(",");
    for (let i = 1; i < lines.length - 1; i++) {
      const obj = {};
      const currentLine = lines[i].split(",");
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentLine[j];
      }
      result.push(obj);
    }
    const resultAdd = { addMembers: result };
    const resultRemove = { removeMembers: result };
    setBatchMembers(JSON.stringify(resultAdd));
    setBatchMembersRemove(JSON.stringify(resultRemove));
  }

  async function handleAddDevice(deviceId, audienceId, policyId) {
    let requestBody = JSON.stringify({
      addMembers: [
        {
          "@odata.type": entityType + ".azureADDevice",
          id: deviceId,
        },
      ],
    });
    await updateDeploymentAudience(requestBody, audienceId);
    refreshPolicy(policyId);
  }

  async function addBatchDeviceToAudience() {
    await updateDeploymentAudience(batchMembers, audienceId);
  }

  async function removeBatchDeviceFromAudience() {
    await updateDeploymentAudience(batchMembersRemove, audienceId);
  }

  useEffect(() => {
    policies.forEach((policy) => {
      if (policy.id == policyToEditId) {
        setPolicyToEdit(policy);
      }
    });
  }, [policies]);

  return (
    <div>
      {spinner ? <SpinnerCommon></SpinnerCommon> : null}
      <Modal
        show={isModelWindowOpen}
        size="lg"
        onHide={toggleModal}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Col>
            {showEditPolicyName === true ? (
              <Modal.Title>
                Policy Settings for&nbsp;
                <input type="text" id="policyNameInput" />
                <OverlayTrigger
                  overlay={
                    <Tooltip id="overlay-upload-button" {...props}>
                      Save Policy Name
                    </Tooltip>
                  }
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                >
                  <span>
                    <FaRegSave
                      className="me-2 ml-2"
                      onClick={() => {
                        let suggestedName =
                          document.getElementById("policyNameInput").value;
                        if (Boolean(suggestedName)) {
                          localStorage.setItem(policyToEditId, suggestedName);
                        } else {
                          suggestedName = localStorage.getItem(policyToEditId);
                        }
                        setSelectedPolicyName(suggestedName);
                        setShowEditPolicyName(false);
                      }}
                    ></FaRegSave>
                  </span>
                </OverlayTrigger>
              </Modal.Title>
            ) : (
              <Modal.Title>
                Policy :&nbsp;
                {localStorage.getItem(policyToEditId)}
                &nbsp;
                <OverlayTrigger
                  overlay={(props) => (
                    <Tooltip id="overlay-upload-button" {...props}>
                      Edit Policy Name
                    </Tooltip>
                  )}
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                >
                  <span>
                    <FaRegEdit
                      className="me-5 ml-2 mb-2"
                      style={{ color: "#212529" }}
                      onClick={() => {
                        setShowEditPolicyName(true);
                      }}
                    ></FaRegEdit>
                  </span>
                </OverlayTrigger>
              </Modal.Title>
            )}
            <Container style={{ padding: 0 }}>
              <div style={{ marginLeft: 0 }}>
                <b>Policy Id :</b>&nbsp; {policyToEditId}
              </div>
            </Container>
          </Col>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <h5>Batch Add or Remove Devices</h5>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit(policyName, policyType);
              }}
            >
              <label>
                Upload a CSV file of device IDs to batch add or remove them from
                your policy.
              </label>
              <Container>
                <Row>
                  <OverlayTrigger
                    overlay={(props) => (
                      <Tooltip id="overlay-upload-button" {...props}>
                        Upload CSV file with devices guid list
                      </Tooltip>
                    )}
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                  >
                    <Button
                      className="btn btn-dark"
                      type="button"
                      style={{ width: "150px" }}
                      onClick={() => {
                        fileInput.current.click();
                      }}
                    >
                      <FaFileUpload></FaFileUpload> Choose File
                    </Button>
                  </OverlayTrigger>
                  <input
                    style={{ display: "none" }}
                    ref={fileInput}
                    type="file"
                    accept=".csv"
                    onChange={(event) => {
                      var file = event.target.files[0];
                      var reader = new FileReader();
                      reader.onload = function (event) {
                        csvJSON(event.target.result);
                      };
                      reader.readAsText(file);
                      setFileChosen(true);
                      setSelectedFileName(event.target.files[0].name);
                    }}
                  />
                  {fileChosen === true ? (
                    <Container fluid>
                      <Row className="mt-3">
                        <Col lg="8">{selectedFileName}</Col>
                        <Col lg="4">
                          <div className="ms-auto">
                            <Col>
                              <Button
                                variant="outline-dark m-1"
                                onClick={() => addBatchDeviceToAudience()}
                              >
                                <BsFillPlusCircleFill></BsFillPlusCircleFill>{" "}
                                Add
                              </Button>
                              <Button
                                variant="outline-dark m-1"
                                onClick={() => removeBatchDeviceFromAudience()}
                              >
                                <AiFillMinusCircle></AiFillMinusCircle> Remove
                              </Button>
                            </Col>
                          </div>
                        </Col>
                      </Row>
                    </Container>
                  ) : null}
                </Row>
              </Container>
            </Form>
          </Container>
          <Form
            onSubmit={async (event) => {
              event.preventDefault();
              setSpinner(true);
              await handleAddDevice(
                event.target.deviceId.value,
                audienceId,
                policyToEditId
              );
              setSpinner(false);
            }}
          >
            <br />
            <Row className="m-1">
              <h5>Single Device</h5>
            </Row>
            <Row className="ms-1">
              <Col lg="8">
                <Form.Group controlId="deviceId">
                  <Form.Control
                    type="text"
                    name="deviceId"
                    required
                    placeholder="Device ID"
                    className="me-sm-2"
                  />
                </Form.Group>
              </Col>
              <Col>
                <div className="d-flex justify-content-end">
                  <Form.Group>
                    <OverlayTrigger
                      overlay={(props) => (
                        <Tooltip id="overlay-upload-button" {...props}>
                          Add single device to policy
                        </Tooltip>
                      )}
                      placement="right"
                      delay={{ show: 250, hide: 400 }}
                    >
                      <Button
                        variant="outline-dark"
                        className="me-5"
                        type="submit"
                      >
                        <BsFillPlusCircleFill></BsFillPlusCircleFill> Add
                      </Button>
                    </OverlayTrigger>
                  </Form.Group>
                </div>
              </Col>
            </Row>
          </Form>

          <MemberTable
            policy={policyToEdit}
            policyMembers={policyToMembers[policyToEditId]}
            spinner={spinner}
            setSpinner={setSpinner}
            refreshPolicy={refreshPolicy}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" className="btn btn-dark" onClick={toggleModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default EditPolicyModal;

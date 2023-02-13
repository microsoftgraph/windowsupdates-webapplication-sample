import { Col, Modal, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { createApproval } from "../../api/createApproval";

const ContentApproveModal = ({
  isOpen,
  toggleModal,
  updateInfo,
  catalogIdToRevokedContentApproval,
  isRecommendedUpdates,
  refreshUpdatesData,
}) => {
  const [startDate, setStartDate] = useState(new Date());
  const { id } = useParams();

  const handleApproveClick = async () => {
    console.log(updateInfo);
    await createApproval(
      startDate,
      !!isRecommendedUpdates,
      updateInfo.catalogEntryId,
      id
    );
    await refreshUpdatesData();
  };

  return (
    <Modal
      show={isOpen}
      onHide={toggleModal}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Approval Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col className="m-2" lg={2}>
            <b>Update : &nbsp;</b> <br />
          </Col>
          <Col className="m-2">
            {updateInfo?.updateName} <br />
          </Col>
        </Row>
        <Row>
          <Col className="m-2" lg={2}>
            <b>Start Date : </b>
          </Col>
          <Col className="m-2">
            <DatePicker
              selected={startDate}
              onChange={(data) => setStartDate(data)}
            />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-dark" onClick={handleApproveClick}>
          Submit Approval
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ContentApproveModal;

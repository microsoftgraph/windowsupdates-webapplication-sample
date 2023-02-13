import { Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { suspendApproval } from "../../api/suspendApproval";

const SuspendModal = ({
  isOpen,
  toggleModal,
  updateInfo,
  catalogIdToApprovals,
  refreshUpdatesData,
}) => {
  const { id } = useParams();

  const handleSuspendClick = async () => {
    for (let approval of catalogIdToApprovals[updateInfo.catalogEntryId]) {
      await suspendApproval(approval.id, id);
    }
    await refreshUpdatesData();
  };

  return (
    <Modal show={isOpen} onHide={toggleModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Suspend Update</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <b>Are you sure you want to suspend this update?</b>
        <br />
        {updateInfo?.updateName}
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-warning" onClick={handleSuspendClick}>
          Submit Suspension
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default SuspendModal;

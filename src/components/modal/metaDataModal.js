import Modal from "react-bootstrap/Modal";
import { Table } from "react-bootstrap";
const MetadataDataModal = ({ isOpen, toggleModal, updateInfo }) => {
  return (
    <Modal
      show={isOpen}
      onHide={toggleModal}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Additional Metadata</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table className="table table-borderless">
          <tbody>
            <tr>
              <td>
                <b>Update Name: </b>
              </td>
              <td>{updateInfo?.updateName}</td>
            </tr>
            <tr>
              <td>
                <b>Description:</b>
              </td>
              <td>{updateInfo?.description}</td>
            </tr>
            <tr>
              <td>
                <b>Class: </b>
              </td>
              <td>{updateInfo?.driverClass}</td>
            </tr>
            <tr>
              <td>
                <b>Manufacturer: </b>
              </td>
              <td>{updateInfo?.manufacturer}</td>
            </tr>
            <tr>
              <td>
                <b>Release Date: </b>
              </td>
              <td>{updateInfo?.releaseDateTime}</td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
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
  );
};

export default MetadataDataModal;

import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

export const IconButton = (props) => {
  const {
    text,
    icon,
    isDark,
    onClick,
    toolTipMessage = "",
    isDisabled = false,
  } = props;

  return (
    <>
      {toolTipMessage ? (
        <OverlayTrigger
          placement="top"
          overlay={(props) => (
            <Tooltip id="overlay-remove-from-service" {...props}>
              {toolTipMessage}
            </Tooltip>
          )}
        >
          {isDisabled ? (
            <span className="d-inline-block">
              <Button
                className={`btn m-2 btn-sm ${isDark ? "btn-dark" : ""}`}
                variant={isDark ? "" : `outline-dark`}
                onClick={onClick}
                disabled={isDisabled}
                style={{ pointerEvents: "none" }}
              >
                {icon}
                {text}
              </Button>
            </span>
          ) : (
            <Button
              className={`btn m-2 btn-sm ${isDark ? "btn-dark" : ""}`}
              variant={isDark ? "" : `outline-dark`}
              onClick={onClick}
            >
              {icon}
              {text}
            </Button>
          )}
        </OverlayTrigger>
      ) : (
        <Button
          className={`btn m-2 btn-sm ${isDark ? "btn-dark" : ""}`}
          variant={isDark ? "" : `outline-dark`}
          onClick={onClick}
        >
          {icon}
          {text}
        </Button>
      )}
    </>
  );
};

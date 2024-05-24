import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BROWSE,
  DESTROY,
  RESET,
} from "../../../../../services/redux/slices/events";
import { fullName, globalSearch } from "../../../../../services/utilities";
import { useToasts } from "react-toast-notifications";
import Swal from "sweetalert2";
import Modal from "./modal";
import DataTable from "../../../../../components/dataTable";
import ReactCalendar from "./calendar";

export default function Events() {
  const [isActive, setIsActive] = useState(true),
    [events, setEvents] = useState([]),
    [selected, setSelected] = useState({}),
    [willCreate, setWillCreate] = useState(true),
    [showModal, setShowModal] = useState(false),
    { token } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess, isLoading } = useSelector(
      ({ events }) => events
    ),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const handleSwitch = () => setIsActive(!isActive);

  useEffect(() => {
    if (token) {
      dispatch(BROWSE(token));
    }

    return () => {
      dispatch(RESET());
    };
  }, [token, dispatch]);

  useEffect(() => {
    setEvents(collections);
  }, [isActive, collections]);

  const toggleModal = () => {
    if (selected._id) {
      setSelected({});
    }
    if (message) {
      dispatch(RESET());
    }
    setShowModal(!showModal);
  };

  const handleUpdate = selected => {
    setSelected(selected);
    if (willCreate) {
      setWillCreate(false);
    }
    toggleModal();
  };

  const handleCreate = () => {
    if (!willCreate) {
      setWillCreate(true);
    }
    toggleModal();
  };

  const handleDestroy = selected =>
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${selected.length} Event(s).`,
      icon: "question",
      confirmButtonText: "Proceed",
    }).then(res => {
      if (res.isConfirmed) {
        const toDestroy = selected.map(item => ({
          _id: item._id,
        }));

        dispatch(
          DESTROY({
            data: toDestroy.length > 1 ? toDestroy : toDestroy[0],
            token,
          })
        );
      }
    });

  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }

    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  const handleSearch = async (willSearch, key) => {
    if (willSearch) {
      setEvents(globalSearch(events, key));
    } else {
      setEvents(collections);
    }
  };

  return (
    <>
      <DataTable
        isLoading={isLoading}
        title="Active Events"
        array={events}
        actions={[
          {
            _icon: "plus",
            _function: handleCreate,
            _condition: () => !isActive,
            _shouldReset: true,
            _disabledOnSearch: true,
          },
          {
            _icon: "sync",
            _function: handleSwitch,
            _shouldReset: true,
            _disabledOnSearch: true,
          },
          {
            _icon: "pen-alt",
            _function: handleUpdate,
            _condition: () => !isActive,
            _haveSelect: true,
            _allowMultiple: false,
            _shouldReset: true,
          },
          {
            _icon: "trash",
            _function: handleDestroy,
            _condition: () => !isActive,
            _haveSelect: true,
            _shouldReset: true,
          },
        ]}
        tableHeads={[
          {
            _text: "Title",
          },
          {
            _text: "Creator",
          },
          {
            _text: "Start",
          },
          {
            _text: "End",
          },
        ]}
        tableBodies={[
          {
            _key: "title",
          },
          {
            _key: "by",
            _format: data => fullName(data.fullName),
          },
          {
            _key: "start",
            _format: data => new Date(data).toLocaleString(),
          },
          {
            _key: "end",
            _format: data => new Date(data).toLocaleString(),
          },
        ]}
        disableSearch={isActive}
        handleSearch={handleSearch}
        toggleComponent={isActive}
        customComponent={<ReactCalendar />}
      />
      <Modal
        key={selected._id || "event-initial-create"}
        selected={selected}
        willCreate={willCreate}
        show={showModal}
        toggle={toggleModal}
      />
    </>
  );
}

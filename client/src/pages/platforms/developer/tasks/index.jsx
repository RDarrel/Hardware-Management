import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FIND, RESET, UPDATE } from "../../../../services/redux/slices/tasks";
import { globalSearch, taskBadge } from "../../../../services/utilities";
import { useToasts } from "react-toast-notifications";
import DataTable from "../../../../components/dataTable";
import Swal from "sweetalert2";
import Modal from "./modal";

export default function Tasks() {
  const [isActive, setIsActive] = useState(true),
    [tasks, setTasks] = useState([]),
    [selected, setSelected] = useState({}),
    [showModal, setShowModal] = useState(false),
    { token, auth } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess, isLoading } = useSelector(
      ({ tasks }) => tasks
    ),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const handleSwitch = () => setIsActive(!isActive);

  useEffect(() => {
    if (token && auth) {
      dispatch(
        FIND({
          token,
          key: {
            developer: auth._id,
          },
        })
      );
    }

    return () => dispatch(RESET());
  }, [token, dispatch, auth]);

  useEffect(() => {
    setTasks(collections.filter(e => e.isDone === !isActive));
  }, [isActive, collections]);

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
      setTasks(globalSearch(tasks, key));
    } else {
      setTasks(collections.filter(e => e.isDone === !isActive));
    }
  };

  const handleTasks = selected =>
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to ${isActive ? "complete" : "revert"} ${
        selected.length
      } Task(s).`,
      icon: "question",
      confirmButtonText: "Proceed",
    }).then(res => {
      if (res.isConfirmed) {
        const toSubmit = selected.map(item => ({
          _id: item._id,
          isDone: isActive,
        }));

        dispatch(
          UPDATE({
            data: toSubmit.length > 1 ? toSubmit : toSubmit[0],
            token,
          })
        );
      }
    });

  const toggleModal = () => setShowModal(!showModal);

  const handleView = selected => {
    setSelected(selected);
    setShowModal(true);
  };

  return (
    <>
      <DataTable
        isLoading={isLoading}
        title={`${isActive ? "Pending" : "Completed"} Tasks`}
        array={tasks}
        actions={[
          {
            _icon: "sync",
            _function: handleSwitch,
            _shouldReset: true,
            _disabledOnSearch: true,
          },
          {
            _icon: "window-close",
            _function: handleTasks,
            _haveSelect: true,
            _shouldReset: true,
            _condition: () => !isActive,
          },
          {
            _icon: "eye",
            _function: handleView,
            _haveSelect: true,
            _allowMultiple: false,
            _shouldReset: true,
            _condition: () => isActive,
          },
        ]}
        tableHeads={[
          {
            _text: "Name",
          },
          {
            _text: "Project",
          },
          {
            _text: "Importance",
          },
          {
            _text: "Complexity Rating",
          },
          {
            _text: "Completed At",
            _condition: () => !isActive,
          },
        ]}
        tableBodies={[
          {
            _key: "name",
          },
          {
            _key: "importance",
            _format: data => taskBadge(data),
          },
          {
            _key: "project",
            _format: data => data.name,
          },
          {
            _key: "intensity",
          },
          {
            _key: "updatedAt",
            _format: data => new Date(data).toLocaleString(),
            _condition: () => !isActive,
          },
        ]}
        handleSearch={handleSearch}
      />
      <Modal
        key={selected._id || "project-initial-create"}
        selected={selected}
        show={showModal}
        toggle={toggleModal}
      />
    </>
  );
}

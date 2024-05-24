import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE, RESET } from "../../../../../services/redux/slices/projects";
import {
  FIND as USERS,
  RESET as USERSRESET,
} from "../../../../../services/redux/slices/users";
import { fullName, globalSearch } from "../../../../../services/utilities";
import { useToasts } from "react-toast-notifications";
import Modal from "./modal";
import DataTable from "../../../../../components/dataTable";

export default function Projects() {
  const [isActive, setIsActive] = useState(true),
    [projects, setProjects] = useState([]),
    [selected, setSelected] = useState({}),
    [willCreate, setWillCreate] = useState(true),
    [showModal, setShowModal] = useState(false),
    { token } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess, isLoading } = useSelector(
      ({ projects }) => projects
    ),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const handleSwitch = () => setIsActive(!isActive);

  useEffect(() => {
    if (token) {
      dispatch(BROWSE(token));
      dispatch(
        USERS({
          token,
          key: {
            role: `{"$in": ["647dd209dced91b0b39444af", "647dd9120874515a8fc47afb"]}`,
          },
        })
      );
    }

    return () => {
      dispatch(RESET());
      dispatch(USERSRESET());
    };
  }, [token, dispatch]);

  useEffect(() => {
    setProjects(
      collections.filter(e => (isActive ? !e.duration?.end : e.duration?.end))
    );
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
      setProjects(globalSearch(projects, key));
    } else {
      setProjects(
        collections.filter(e => (isActive ? !e.duration?.end : e.duration?.end))
      );
    }
  };

  return (
    <>
      <DataTable
        isLoading={isLoading}
        title={`${isActive ? "On Going" : "Completed"} Projects`}
        array={projects}
        actions={[
          {
            _icon: "plus",
            _function: handleCreate,
            _condition: () => isActive,
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
            _icon: isActive ? "pen-alt" : "eye",
            _function: handleUpdate,
            _haveSelect: true,
            _allowMultiple: false,
            _shouldReset: true,
          },
        ]}
        tableHeads={[
          {
            _text: "Name",
          },
          {
            _text: "Client",
          },
          {
            _text: "Developers",
          },
        ]}
        tableBodies={[
          {
            _key: "name",
          },
          {
            _key: "client",
            _format: data => fullName(data.fullName),
          },
          {
            _key: "developers",
            _format: data => data.length,
          },
        ]}
        handleSearch={handleSearch}
      />
      <Modal
        key={selected._id || "project-initial-create"}
        selected={selected}
        willCreate={willCreate}
        show={showModal}
        toggle={toggleModal}
        isActive={isActive}
      />
    </>
  );
}

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BROWSE,
  DESTROY,
  UPDATE,
  RESET,
} from "../../../../../services/redux/slices/users";
import {
  BROWSE as ROLES,
  RESET as ROLESRESET,
} from "../../../../../services/redux/slices/roles";
import { fullName, globalSearch } from "../../../../../services/utilities";
import { useToasts } from "react-toast-notifications";
import Swal from "sweetalert2";
import Modal from "./modal";
import DataTable from "../../../../../components/dataTable";

export default function Users() {
  const [isActive, setIsActive] = useState(true),
    [users, setUsers] = useState([]),
    [selected, setSelected] = useState({}),
    [showModal, setShowModal] = useState(false),
    { auth, token } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess, isLoading } = useSelector(
      ({ users }) => users
    ),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const handleSwitch = () => setIsActive(!isActive);

  useEffect(() => {
    if (token) {
      dispatch(BROWSE(token));
      dispatch(ROLES(token));
    }

    return () => {
      dispatch(RESET());
      dispatch(ROLESRESET());
    };
  }, [token, dispatch]);

  useEffect(() => {
    setUsers(collections.filter(e => e.wasBanned === !isActive));
  }, [isActive, collections]);

  const toggleModal = () => setShowModal(!showModal);

  const handleUpdate = selected => {
    setSelected(selected);
    setShowModal(true);
  };

  const handleRestore = selected =>
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to restore ${selected.length} User(s).`,
      icon: "question",
      confirmButtonText: "Proceed",
    }).then(res => {
      if (res.isConfirmed) {
        const toRestore = selected.map(item => ({
          _id: item._id,
          wasBanned: false,
          banned: {},
        }));

        dispatch(
          UPDATE({
            data: toRestore.length > 1 ? toRestore : toRestore[0],
            token,
          })
        );
      }
    });

  const handleDestroy = async selected => {
    const { value: reason } = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${selected.length} User(s).`,
      icon: "question",
      input: "textarea",
      inputPlaceholder: "Please specify a reason",
      confirmButtonText: "Proceed",
      inputValidator: value => {
        if (!value) {
          return "You need to write something!";
        }
      },
    });

    if (reason) {
      const toDelete = selected.map(item => ({
        _id: item._id,
        wasBanned: true,
        banned: {
          for: reason,
          at: new Date().toLocaleString(),
          by: auth._id,
        },
      }));

      dispatch(
        DESTROY({
          data: toDelete.length > 1 ? toDelete : toDelete[0],
          token,
        })
      );
    }
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
      setUsers(globalSearch(users, key));
    } else {
      setUsers(collections.filter(e => e.wasBanned === !isActive));
    }
  };

  return (
    <>
      <DataTable
        isLoading={isLoading}
        title={`${isActive ? "Active" : "Banned"} Users`}
        array={users}
        actions={[
          {
            _icon: "sync",
            _function: handleSwitch,
            _shouldReset: true,
            _disabledOnSearch: true,
          },
          {
            _icon: isActive ? "user-shield" : "undo-alt",
            _function: isActive ? handleUpdate : handleRestore,
            _haveSelect: true,
            _allowMultiple: !isActive,
            _shouldReset: true,
          },
          {
            _icon: "trash",
            _function: handleDestroy,
            _condition: () => isActive,
            _haveSelect: true,
            _shouldReset: true,
          },
        ]}
        tableHeads={[
          {
            _text: "Fullname",
          },
          {
            _text: "E-mail Address",
          },
          {
            _text: "Role",
          },
          {
            _text: "Reason",
            _condition: () => !isActive,
          },
          {
            _text: "Date",
            _condition: () => !isActive,
          },
        ]}
        tableBodies={[
          {
            _key: "fullName",
            _format: data => fullName(data),
          },
          {
            _key: "email",
          },
          {
            _key: "role",
            _format: data => data?.name,
          },
          {
            _key: "banned",
            _format: data => data?.for,
            _condition: () => !isActive,
          },
          {
            _key: "banned",
            _format: data => data?.at,
            _condition: () => !isActive,
          },
        ]}
        handleSearch={handleSearch}
      />
      <Modal selected={selected} show={showModal} toggle={toggleModal} />
    </>
  );
}

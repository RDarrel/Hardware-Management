import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE, RESET } from "../../../../../services/redux/slices/tasks";
import {
  FIND as PROJECTS,
  RESET as PROJECTSRESET,
} from "../../../../../services/redux/slices/projects";
import {
  fullName,
  globalSearch,
  taskBadge,
} from "../../../../../services/utilities";
import { useToasts } from "react-toast-notifications";
import Modal from "./modal";
import DataTable from "../../../../../components/dataTable";

export default function Tasks() {
  const [isActive, setIsActive] = useState(true),
    [tasks, setTasks] = useState([]),
    [selected, setSelected] = useState({}),
    [willCreate, setWillCreate] = useState(true),
    [showModal, setShowModal] = useState(false),
    { token } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess, isLoading } = useSelector(
      ({ tasks }) => tasks
    ),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const handleSwitch = () => setIsActive(!isActive);

  useEffect(() => {
    if (token) {
      dispatch(BROWSE(token));
      dispatch(
        PROJECTS({
          token,
          key: {
            wasRejected: false,
          },
        })
      );
    }

    return () => {
      dispatch(RESET());
      dispatch(PROJECTSRESET());
    };
  }, [token, dispatch]);

  useEffect(() => {
    // if (collections.length > 0) {
    //   const tasks = collections.filter(e => e.isDone === true);

    //   // Calculate performance for each developer
    //   const performanceMap = new Map();

    //   tasks.forEach(task => {
    //     const developerId = task.developer._id;
    //     const performance = task.intensity;

    //     if (performanceMap.has(developerId)) {
    //       performanceMap.set(
    //         developerId,
    //         performanceMap.get(developerId) + performance
    //       );
    //     } else {
    //       performanceMap.set(developerId, performance);
    //     }
    //   });

    //   // Sort the performance map by performance value
    //   const sortedPerformance = new Map(
    //     [...performanceMap.entries()].sort((a, b) => b[1] - a[1])
    //   );

    //   // Generate labels and data arrays for the bar chart
    //   const labels = Array.from(sortedPerformance.keys()).map(developerId => {
    //     const task = tasks.find(task => task.developer._id === developerId);
    //     return fullName(task.developer.fullName);
    //   });

    //   const data = Array.from(sortedPerformance.values());

    //   console.log("Labels:", labels);
    //   console.log("Data:", data);
    // }

    setTasks(collections.filter(e => e.isDone === !isActive));
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
      setTasks(globalSearch(tasks, key));
    } else {
      setTasks(collections.filter(e => e.isDone === !isActive));
    }
  };

  return (
    <>
      <DataTable
        isLoading={isLoading}
        title={`${isActive ? "Pending" : "Completed"} Tasks`}
        array={tasks}
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
            _text: "Developer",
          },
          {
            _text: "Complexity Rating",
          },
          {
            _text: "Importance",
          },
          {
            _text: "Project",
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
            _key: "developer",
            _format: data => fullName(data.fullName),
          },
          {
            _key: "intensity",
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
        willCreate={willCreate}
        isActive={isActive}
        show={showModal}
        toggle={toggleModal}
      />
    </>
  );
}

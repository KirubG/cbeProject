import { useEffect, useState } from "react";
import SearchBar from "../components/searchBar/SearchBar.jsx";
import { useLocation, useSearchParams } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

import { toast } from "react-toastify";
import DeleteConfirmation from "../components/DeleteConfirmation.jsx";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserRoleMutation,
} from "../features/userApiSlice.js";
import EditUser from "../components/Edit/EditUser.jsx";
import { rolesList } from "../util/userRoles.js";
import { capitalizeFirstLetter } from "../util/capitalize.js";
import Button from "../components/button/Button.jsx";
import CreateUser from "./CreateUser.jsx";
import { useGetRolesQuery } from "../features/roleApiSlice.js";

function UserList() {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");

  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [userToBeDelete, setUserToBeDelete] = useState({
    title: "user",
    itemId: "",
    name: "",
  }); // hold the user to be deleted
  const location = useLocation();
  const { data, refetch } = useGetUsersQuery(query);
  const { data: roles } = useGetRolesQuery();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleCreateClick = () => {
    setShowCreate((prev) => !prev);
  };

  function showEditModal() {
    setShowEdit(true);
  }

  useEffect(() => {
    setUsers(data);
  }, [data]);

  useEffect(() => {
    refetch();
  }, [location, query]);

  const handleCloseModal = () => {
    setShowDelete(false);
  };
  const CloseEdit = () => {
    setShowEdit(false);
  };
  const handleCaseStateChange = async (e, userId) => {
    try {
      const response = await updateUserRole({
        role: e.target.value,
        id: userId,
      }).unwrap();
      toast.success(response, {
        position: "bottom-right",
      });
    } catch (error) {
      toast.error(error.data, {
        position: "bottom-right",
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await deleteUser(userToBeDelete.itemId).unwrap();
      toast.success(response, {
        position: "bottom-right",
      });
    } catch (error) {
      toast.error(error.data, {
        position: "bottom-right",
      });
    } finally {
      handleCloseModal();
    }
  };

  return (
    <div className=" w-full h-full rounde-d-[10px] flex flex-col gap-2">
      <div className="flex gap-3">
        <SearchBar className=" !w-full" placeholder="Search by name or email" />
        <Button onClick={handleCreateClick}>Create</Button>
      </div>
      <table className=" text-sm w-full bg-white p-5 rounded-lg border-collapse ">
        <thead className=" text-left">
          <tr className=" border-solid border-2 border-gray-300">
            <th className="p-[10px]">User Name</th>
            <th className="p-[10px]">Email</th>
            <th className="p-[10px]">Role</th>
            <th className="p-[10px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user, idx) => {
            return (
              <tr
                className="hover:bg-light-gray hover:cursor-pointer border-solid border-2 border-gray-300"
                key={user._id}
              >
                <td className="p-[10px]">{user.name}</td>
                <td className="p-[10px]">{user.email}</td>

                <td className="p-[10px]" onClick={(e) => e.stopPropagation()}>
                  <select
                    className=" p-1 outline-none border-none cursor-pointer bg-transparent "
                    defaultValue={user.roleType?._id}
                    onChange={(e) => handleCaseStateChange(e, user._id)}
                  >
                    {roles?.map((role) => {
                      if (role.roleType == user.roleType?.roleType) {
                        return (
                          <option key={role._id} value={role._id}>
                            {role.roleName}
                          </option>
                        );
                      } else {
                        return (
                          <option key={role._id} value={role._id}>
                            {role.roleName}
                          </option>
                        );
                      }
                    })}
                  </select>
                </td>
                <td className="p-[10px]">
                  <div className="table_actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUserId(user._id);
                        showEditModal();
                      }}
                    >
                      <MdEdit size={20} color="green" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDelete(true);
                        setUserToBeDelete((prev) => ({
                          ...prev,
                          itemId: user._id,
                          name: user.name,
                        }));
                      }}
                    >
                      <MdDelete size={20} color="red" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {showCreate && <CreateUser handleClose={handleCreateClick} />}
      {showEdit && <EditUser userId={userId} onClose={CloseEdit} />}
      {showDelete && (
        <DeleteConfirmation
          item={userToBeDelete}
          onClose={handleCloseModal}
          handleDeleteItem={handleDeleteUser}
        />
      )}
    </div>
  );
}

export default UserList;

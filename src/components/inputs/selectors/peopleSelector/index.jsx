import { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Checkbox,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { EditOffSharp, EditSharp, Security } from "@mui/icons-material";
import {
  getDatabase,
  off,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  ref,
  update,
} from "firebase/database";
import { FirebaseContext } from "../../../../contexts/firebaseContext";
import { utils } from "../../../../utils/utils";

const PeopleSelector = () => {
  const { app } = useContext(FirebaseContext);
  const [people, setPeople] = useState([]);

  useEffect(() => {
    const db = getDatabase(app);
    const membersRef = ref(db, `participants${window.location.pathname}`);
    onChildAdded(membersRef, (member) => {
      setPeople((prev) => [...prev, member.val()]);
    });
    onChildRemoved(membersRef, (member) => {
      setPeople((prev) => prev.filter((p) => p.id !== member.key));
    });
    onChildChanged(membersRef, (member) => {
      setPeople((prev) =>
        prev.map((person) => ({
          ...person,
          write: person.id === member.key ? member.val().write : person.write,
        }))
      );
    });

    return () => off(membersRef);
  }, [app]);

  const handleToggleWrite = (id, checked) => {
    const db = getDatabase(app);
    const membersRef = ref(db, `participants${window.location.pathname}/${id}`);
    update(membersRef, { write: checked });
  };

  return (
    <List>
      {!!people &&
        !!people.length &&
        people.map((person) => (
          <ListItem
            key={person.id}
            secondaryAction={
              !!person.admin ? (
                <Security />
              ) : (
                <Checkbox
                  edge="end"
                  checked={person.write}
                  checkedIcon={<EditSharp />}
                  icon={<EditOffSharp />}
                  onChange={(e) =>
                    handleToggleWrite(person.id, e.target.checked)
                  }
                />
              )
            }
          >
            <ListItemAvatar>
              <Avatar>{utils.formatAvatar(person.name)}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={person.name} />
          </ListItem>
        ))}
    </List>
  );
};

export default PeopleSelector;

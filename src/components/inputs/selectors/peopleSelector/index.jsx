import { EditOffSharp, EditSharp } from "@mui/icons-material";
import { Avatar, Checkbox, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { getDatabase, onChildAdded, onChildChanged, onChildRemoved, ref, update } from "firebase/database";
import { useEffect } from "react";
import { useState } from "react";
import { useFirebaseContext } from "../../../../contexts/firebaseContext";

const PeopleSelector = () => {
    const { app } = useFirebaseContext();
    const [people, setPeople] = useState([])

    useEffect(() => {
        const db = getDatabase(app);
        const membersRef = ref(db, `sessions${window.location.pathname}`);
        onChildAdded(membersRef, (member) => {
            setPeople([...people, member.val()])
        });
        onChildRemoved(membersRef, (member) => {
            setPeople(people.filter(p => p.id !== member.key));
        });
        onChildChanged(membersRef, (member) => {
            const changed = people.find(p => p.id === member.key);
            const data = member.val()
            changed.write = data.write;
        });
    }, [app])

    const handleToggleWrite = (id, checked) => {
        const db = getDatabase(app);
        const membersRef = ref(db, `sessions${window.location.pathname}/${id}`);
        update(membersRef, { write: checked })
    }
    
    return (
        <List>
            {
                !!people && !!people.length && people.map((person) => (
                    <ListItem 
                        key={person.id}
                        secondaryAction={
                            <Checkbox
                                edge="end"
                                checked={person.write}
                                checkedIcon={<EditSharp/>}
                                icon={<EditOffSharp/>}
                                onChange={(e) => handleToggleWrite(person.id, e.target.checked)}
                            />
                        }
                    >
                        <ListItemAvatar>
                            <Avatar>{person.name[0]}</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={person.name}/>
                    </ListItem>
                ))
            }
        </List>
    )
}
export default PeopleSelector;
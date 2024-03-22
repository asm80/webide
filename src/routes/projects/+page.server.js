import { getDB } from '$db/mongo';

export const load = async (event) => {
    const {session} = await event.parent();
    let projects = []
    if (session?.user?.userName) {
        //do db load
        projects = (await getDB().collection('projects').find({owner:session.user.userName}).project({name:1}).toArray())
        .map(q=>{q._id = q._id.toString(); return q})
    }
    //console.log("Projects",projects)
    return {
      projects: projects
    };
  };
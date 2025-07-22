export default function canSee(user, ownerID) {
	if (!(user.isAdmin || user.id === ownerID)) res.sendStatus(403);
}

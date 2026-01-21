import {
	collection,
	doc,
	getDoc,
	setDoc,
	updateDoc,
	onSnapshot,
	arrayUnion,
	arrayRemove,
	serverTimestamp,
	Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface FrameworkData {
	id: string;
	ownerId: string;
	ownerEmail: string;
	ownerName: string;
	collaborators: Array<{
		email: string;
		name: string;
		addedAt: Timestamp;
	}>;
	selectedModel: string | null;
	discussions: {
		[key: string]: string;
	};
	contract: {
		model: string;
		husband: string;
		wife: string;
		rules: string;
		transparency: string;
		crisis: string;
		review: string;
	};
	createdAt: Timestamp;
	updatedAt: Timestamp;
	lastEditedBy: string;
}

// Generate unique ID for new framework
export function generateFrameworkId(): string {
	return `fw_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Create new framework document
export async function createFramework(
	userId: string,
	userEmail: string,
	userName: string,
): Promise<string> {
	const frameworkId = generateFrameworkId();
	const frameworkRef = doc(db, "frameworks", frameworkId);

	const newFramework: Omit<FrameworkData, "id"> = {
		ownerId: userId,
		ownerEmail: userEmail,
		ownerName: userName,
		collaborators: [],
		selectedModel: null,
		discussions: {},
		contract: {
			model: "",
			husband: "",
			wife: "",
			rules: "",
			transparency: "",
			crisis: "",
			review: "",
		},
		createdAt: serverTimestamp() as Timestamp,
		updatedAt: serverTimestamp() as Timestamp,
		lastEditedBy: userEmail,
	};

	await setDoc(frameworkRef, newFramework);
	return frameworkId;
}

// Get framework data
export async function getFramework(
	frameworkId: string,
): Promise<FrameworkData | null> {
	const frameworkRef = doc(db, "frameworks", frameworkId);
	const frameworkSnap = await getDoc(frameworkRef);

	if (frameworkSnap.exists()) {
		return {
			id: frameworkSnap.id,
			...frameworkSnap.data(),
		} as FrameworkData;
	}

	return null;
}

// Update framework data
export async function updateFramework(
	frameworkId: string,
	updates: Partial<Omit<FrameworkData, "id" | "ownerId" | "createdAt">>,
	userEmail: string,
): Promise<void> {
	const frameworkRef = doc(db, "frameworks", frameworkId);

	await updateDoc(frameworkRef, {
		...updates,
		updatedAt: serverTimestamp(),
		lastEditedBy: userEmail,
	});
}

// Add collaborator to framework
export async function addCollaborator(
	frameworkId: string,
	collaboratorEmail: string,
	collaboratorName: string,
): Promise<void> {
	const frameworkRef = doc(db, "frameworks", frameworkId);

	await updateDoc(frameworkRef, {
		collaborators: arrayUnion({
			email: collaboratorEmail,
			name: collaboratorName,
			addedAt: serverTimestamp(),
		}),
		updatedAt: serverTimestamp(),
	});
}

// Remove collaborator from framework
export async function removeCollaborator(
	frameworkId: string,
	collaboratorEmail: string,
): Promise<void> {
	const frameworkRef = doc(db, "frameworks", frameworkId);
	const framework = await getFramework(frameworkId);

	if (framework) {
		const collaborator = framework.collaborators.find(
			(c) => c.email === collaboratorEmail,
		);
		if (collaborator) {
			await updateDoc(frameworkRef, {
				collaborators: arrayRemove(collaborator),
				updatedAt: serverTimestamp(),
			});
		}
	}
}

// Subscribe to framework changes (real-time)
export function subscribeToFramework(
	frameworkId: string,
	callback: (data: FrameworkData | null) => void,
): () => void {
	const frameworkRef = doc(db, "frameworks", frameworkId);

	return onSnapshot(frameworkRef, (doc) => {
		if (doc.exists()) {
			callback({
				id: doc.id,
				...doc.data(),
			} as FrameworkData);
		} else {
			callback(null);
		}
	});
}

// Check if user has access to framework
export function hasAccess(
	framework: FrameworkData,
	userEmail: string,
): boolean {
	return (
		framework.ownerEmail === userEmail ||
		framework.collaborators.some((c) => c.email === userEmail)
	);
}

// Check if user is owner
export function isOwner(framework: FrameworkData, userEmail: string): boolean {
	return framework.ownerEmail === userEmail;
}

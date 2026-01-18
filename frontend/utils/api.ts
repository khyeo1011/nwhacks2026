import { Quest, QuestDetails } from "@/types/types"

const url = process.env.NEXT_PUBLIC_URL || "http://127.0.0.1:5000"

export async function register(userId: string, password: string) {
    const response = await fetch(url + "/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userId, password }),
    })
    return response.json()
}

export async function login(userId: string, password: string) {
    const response = await fetch(url + "/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userId, password }),
    })
    return response.json()
}

export function getPendingQuests(userId: string): Quest[] {
    const sample = 
        [
            { questId: 1, prompt: "test", hostId: "testHost1", date: Date.now() },
            { questId: 2, prompt: "test", hostId: "testHost2", date: Date.now() },
            { questId: 3, prompt: "test", hostId: "testHost3", date: Date.now() },
            { questId: 4, prompt: "test", hostId: "testHost4", date: Date.now() },
            { questId: 5, prompt: "test", hostId: "testHost5", date: Date.now() },
        ]

    return sample
}

export function getCompletedQuests(userId: string): Quest[] {
    const sample = 
        [
            { questId: 1, prompt: "test", hostId: "testHost1", date: Date.now() },
            { questId: 2, prompt: "test", hostId: "testHost2", date: Date.now() },
            { questId: 3, prompt: "test", hostId: "testHost3", date: Date.now() },
            { questId: 4, prompt: "test", hostId: "testHost4", date: Date.now() },
            { questId: 5, prompt: "test", hostId: "testHost5", date: Date.now() },
        ]

    return sample
}

export async function createQuest(prompt: string, hostId: string, userIds: string[], image: any, time: number) {
    const response = await fetch(url + "/api/create-quest", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt, hostId: hostId, userIds: userIds, photo: image, time: time }),
    })
    return response.json()
}

export async function getPrompt() {
    const response = await fetch(url + "/api/get-prompt", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
}

export async function completeQuest(questId: string, userId: string, image: any, time: number) {
    const response = await fetch(url + "/api/complete-quest", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ questId: questId, userId: userId, photo: image, time: time }),
    })
    return response.json()
}

function getQuestDetails(questId: string): QuestDetails {
    const sample: QuestDetails = {
        questId: 1,
        prompt: "test prompt",
        hostId: "testHost",
        date: Date.now(),
        winner: "testUser",
        participants: [
            { questId: 1, userId: "testUser1", score: 100, time: 30, photo: null },
            { questId: 1, userId: "testUser2", score: 80, time: 45, photo: null },
            { questId: 1, userId: "testUser3", score: 60, time: 60, photo: null },
        ],
    }
    return sample
}

local Schedules = {}
-- Schedules[id] =  { title, description, startTime, endTime }

local function Load()
    local file = LoadResourceFile(GetCurrentResourceName(), "schedules.json")
    if file then Schedules = json.decode(file) return end
    print("[DGSC]schedule.json not found...")
    TriggerEvent("DGSC:Server:Schedule:LoadError")
end

local function Save()
    local content = json.encode(Schedules, { indent = true })
    SaveResourceFile(GetCurrentResourceName(), "schedules.json", content, -1)
end

local function GenerateUUID()
    local random = math.random
    local template = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

    return string.gsub(template, "[x]", function (c)
        local v = (c == "x") and random(0, 0xf) or random(8, 0xb)
        return string.format("%x", v)
    end)
end

local function Register(data)
    local id = GenerateUUID()

    Schedules[id] = {
        title = data.title,
        description = data.description,
        startTime = data.startTime,
        endTime = data.endTime
    }
    Save()
end

local function Edit(data)
    if not Schedules[data.id] then return end
    Schedules[data.id] = {
        title = data.title,
        description = data.description,
        startTime = data.startTime,
        endTime = data.endTime
    }
    Save()
end

local function SendClient(src)
    if src then
        TriggerClientEvent("DGSC:Client:Schedule:Response", src, Schedules)
    else
        TriggerClientEvent("DGSC:Client:Schedule:Response", -1, Schedules)
    end
end

RegisterNetEvent("onResourceStart")
AddEventHandler("onResourceStart", function (resource)
    if resource == GetCurrentResourceName() then
        Load()
    end
end)

RegisterNetEvent("DGSC:Server:Schedule:Request")
AddEventHandler("DGSC:Server:Schedule:Request", function ()
    local src = source
    SendClient(src)
end)

RegisterNetEvent("DGSC:Server:Schedule:Register")
AddEventHandler("DGSC:Server:Schedule:Register", function (data)
    Register(data)
    SendClient(-1)
end)

RegisterNetEvent("DGSC:Server:Schedule:Edit")
AddEventHandler("DGSC:Server:Schedule:Edit", function (data)
    Edit(data)
    SendClient(-1)
end)

RegisterNetEvent("DGSC:Server:Schedule:Delete")
AddEventHandler("DGSC:Server:Schedule:Delete", function (id)
    Schedules[id] = nil
    Save()
    SendClient(-1)
end)

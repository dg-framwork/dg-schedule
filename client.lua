Citizen.CreateThread(function ()
    while not NetworkIsSessionStarted() do
        Citizen.Wait(100)
    end

    TriggerServerEvent("DGSC:Server:Schedule:Request")
end)

local Schedules = {}

local function Load(schedules)
    Schedules = {}
    if schedules then
        for id, schedule in pairs(schedules) do
            if schedule then
                Schedules[id] = schedule
            end
        end
    end
end

local function Register(data)
    TriggerServerEvent("DGSC:Server:Schedule:Register", data)
end

local function Edit(data)
    TriggerServerEvent("DGSC:Server:Schedule:Edit", data)
end

local function Delete(id)
    TriggerServerEvent("DGSC:Server:Schedule:Delete", id)
end

local function SendNUI()
    SendNUIMessage({ action = "DGSC:NUI:Schedule:Response", schedules = Schedules })
end

RegisterNetEvent("DGSC:Client:Schedule:Response")
AddEventHandler("DGSC:Client:Schedule:Response", function (schedules)
    Load(schedules)
    Citizen.Wait(100)
    SendNUI()
end)

RegisterNUICallback("DGSC:NUI:Manage:Hide", function (_, cb)
    SetNuiFocus(false, false)
    SendNUIMessage({ action = "DGSC:NUI:Manage:Hide" })
    cb({})
end)

RegisterNUICallback("DGSC:NUI:Schedule:Refresh", function (_, cb)
    TriggerServerEvent("DGSC:Server:Schedule:Request")
    SendNUI()
    cb({})
end)

RegisterNUICallback("DGSC:NUI:Schedule:Register", function (data, cb)
    Register(data)
    cb({})
end)

RegisterNUICallback("DGSC:NUI:Schedule:Edit", function (data, cb)
    Edit(data)
    cb({})
end)

RegisterNUICallback("DGSC:NUI:Schedule:Delete", function (data, cb)
    local id = data.id
    Delete(id)
    cb({})
end)

RegisterCommand("DGSC:NUI:Manage:Show", function ()
    SetNuiFocus(true, true)
    SendNUIMessage({ action = "DGSC:NUI:Manage:Show" })
end)

RegisterCommand("DGSC:NUI:Manage:Hide", function ()
    SetNuiFocus(false, false)
    SendNUIMessage({ action = "DGSC:NUI:Manage:Hide" })
end)

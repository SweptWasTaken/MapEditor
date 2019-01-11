class 'MapEditorClient'

require "__shared/Util"
require "__shared/ObjectManager"
require "__shared/Backend"

local m_Freecam = require "Freecam"
local m_Editor = require "Editor"
local m_UIManager = require "UIManager"
local m_InstanceParser = require "InstanceParser"
local m_CinematicTools = require "CinematicTools"

ObjectManager = ObjectManager(Realm.Realm_Client)
Backend = Backend(Realm.Realm_Client)


function MapEditorClient:__init()
	print("Initializing MapEditorClient")
	self:RegisterVars()
	self:RegisterEvents()
end

function MapEditorClient:RegisterVars()
end

function MapEditorClient:RegisterEvents()
	--Game events
	Events:Subscribe('Client:UpdateInput', self, self.OnUpdateInput)
	Events:Subscribe('Extension:Loaded', self, self.OnLoaded)
	Events:Subscribe('Engine:Message', self, self.OnEngineMessage)
	Events:Subscribe('Engine:Update', self, self.OnUpdate)
	Events:Subscribe('Partition:Loaded', self, self.OnPartitionLoaded)
	Events:Subscribe('Client:LevelLoaded', self, self.OnLevelLoaded)

	Events:Subscribe('Level:Destroy', self, self.OnLevelDestroy)



	Events:Subscribe('UpdateManager:Update', self, self.OnUpdatePass)

	-- Editor Events
	NetEvents:Subscribe('MapEditor:ReceiveCommand', self, self.OnReceiveCommand)
	NetEvents:Subscribe('MapEditorClient:ReceiveUpdate', self, self.OnReceiveUpdate)

	-- WebUI events
	Events:Subscribe('MapEditor:SendToServer', self, self.OnSendToServer)
	Events:Subscribe('MapEditor:ReceiveCommand', self, self.OnReceiveCommand)
	Events:Subscribe('MapEditor:ReceiveMessage', self, self.OnReceiveMessage)

	Events:Subscribe('MapEditor:EnableFreecamMovement', self, self.OnEnableFreecamMovement)
	Events:Subscribe('MapEditor:DisableFreecam', self, self.OnDisableFreecam)

    Hooks:Install('Input:PreUpdate', 200, self, self.OnUpdateInputHook)
    Hooks:Install('UI:PushScreen', 999, self, self.OnPushScreen)
    Hooks:Install('ClientEntityFactory:Create',999, self, self.OnEntityCreate)

	-- Cinematic Tools events
	self.m_StateAddedEvent = Events:Subscribe('VE:StateAdded', self, self.OnStateAdded)
	self.m_StateRemovedEvent = Events:Subscribe('VE:StateRemoved', self, self.OnStateRemoved)
	self.m_OnLoadedEvent = Events:Subscribe('ExtensionLoaded', self, self.OnLoaded)
	self.m_OnUpdateInputEvent = Events:Subscribe('Client:UpdateInput', self, self.OnUpdateInput)
	self.m_OnWebUIUpdateEvent = Events:Subscribe('CT:UpdateValue', self, self.OnUpdateValue)
	self.m_OnWebUIUpdateEvent = Events:Subscribe('CT:SetKeyboard', self, self.OnSetKeyboard)
end

----------- Game functions----------------

function MapEditorClient:OnUpdate(p_Delta, p_SimulationDelta)
	m_Editor:OnUpdate(p_Delta, p_SimulationDelta)
end

function MapEditorClient:OnLevelLoaded(p_MapName, p_GameModeName)
	m_Editor:OnLevelLoaded(p_MapName, p_GameModeName)
end

function MapEditorClient:OnLoaded()
	WebUI:Init()
	WebUI:Show()
end
function MapEditorClient:OnPartitionLoaded(p_Partition)
	m_InstanceParser:OnPartitionLoaded(p_Partition)
end

function MapEditorClient:OnEngineMessage(p_Message) 
	m_Editor:OnEngineMessage(p_Message) 
end
function MapEditorClient:OnPushScreen(p_Hook, p_Screen, p_GraphPriority, p_ParentGraph)
	m_UIManager:OnPushScreen(p_Hook, p_Screen, p_GraphPriority, p_ParentGraph)
end
function MapEditorClient:OnUpdateInputHook(p_Hook, p_Cache, p_DeltaTime)
	m_Freecam:OnUpdateInputHook(p_Hook, p_Cache, p_DeltaTime)
end

function MapEditorClient:OnUpdateInput(p_Delta)
	m_Freecam:OnUpdateInput(p_Delta)
	m_UIManager:OnUpdateInput(p_Delta)
end
function MapEditorClient:OnUpdatePass(p_Delta, p_Pass)
	m_Editor:OnUpdatePass(p_Delta, p_Pass)
end
function MapEditorClient:OnLevelDestroy()
	print("Destroy!")
	Backend:OnLevelDestroy()
end

function MapEditorClient:OnEntityCreate(p_Hook, p_Data, p_Transform)
    m_Editor:OnEntityCreate(p_Hook, p_Data, p_Transform)
end

----------- Editor functions----------------
function MapEditorClient:OnSendToServer(p_Command)
	m_Editor:OnSendToServer(p_Command)
end
function MapEditorClient:OnReceiveCommand(p_Command)
	m_Editor:OnReceiveCommand(p_Command)
end
function MapEditorClient:OnReceiveMessage(p_Message)
	m_Editor:OnReceiveMessage(p_Message)
end

function MapEditorClient:OnReceiveUpdate(p_Update)
	m_Editor:OnReceiveUpdate(p_Update)
end

----------- WebUI functions----------------


function MapEditorClient:OnEnableFreecamMovement()
	m_UIManager:OnEnableFreecamMovement()
end

function MapEditorClient:OnDisableFreecam()
	m_UIManager:OnDisableFreecam()
end

------- Cinematic Tools functions -------

function MapEditorClient:OnSetKeyboard(p_Value)
	m_CinematicTools:OnSetKeyboard(p_Value)
end

function MapEditorClient:OnLoaded()
	m_CinematicTools:OnLoaded()
end

function MapEditorClient:OnUpdateInput(p_Delta, p_SimulationDelta)
	m_CinematicTools:OnUpdateInput(p_Delta, p_SimulationDelta)
end

function MapEditorClient:LoadPreset(p_Preset, p_LerpTime)
	m_CinematicTools:LoadPreset(p_Preset, p_LerpTime)
end

function MapEditorClient:RemovePreset(p_PresetName, p_LerpTime)
	m_CinematicTools:RemovePreset(p_PresetName, p_LerpTime)
end

function MapEditorClient:UpdateLerp(p_Delta)
	m_CinematicTools:UpdateLerp(p_Delta)
end

function MapEditorClient:LoadPresets(p_LerpTime)
	m_CinematicTools:LoadPresets(p_LerpTime)
end

function MapEditorClient:OnStateAdded(p_State)
	m_CinematicTools:OnStateAdded(p_State)
end

function MapEditorClient:OnStateRemoved(p_State)
	m_CinematicTools:OnStateRemoved(p_State)
end

function MapEditorClient:FixEnvironmentState(p_State)
	m_CinematicTools:FixEnvironmentState(p_State)
end

function MapEditorClient:SendState(p_Class, p_State, p_TypeInfo)
	m_CinematicTools:SendState(p_Class, p_State, p_TypeInfo)
end

function MapEditorClient:SendValue(p_Class, p_Field, p_Type, p_Value)
	m_CinematicTools:SendValue(p_Class, p_Field, p_Type, p_Value)
end

function MapEditorClient:CreateData(p_DataName)
	m_CinematicTools:CreateData(p_DataName)
end

function MapEditorClient:SendEnum(p_Enum)
	m_CinematicTools:SendEnum(p_Enum)
end

function MapEditorClient:OnUpdateValue(p_Contents, p_LerpTime)
	m_CinematicTools:OnUpdateValue(p_Contents, p_LerpTime)
end

function MapEditorClient:OnUpdateValue(p_Contents, p_LerpTime)
	m_CinematicTools:OnUpdateValue(p_Contents, p_LerpTime)
end




return MapEditorClient()

// String.format(), courtesy of https://journalofasoftwaredev.wordpress.com/2011/10/30/replicating-string-format-in-javascript/
String.prototype.format = function()
{
    /*
    String.format() https://en.wikipedia.org/wiki/String_interpolation

    returns a templated string in which the placeholders are replaced with their corresponding values
    Example
    -----------
    "{0} {1}".format("Hello", "world");
    Hello world
    */
   var content = this;
   for (var i=0; i < arguments.length; i++)
   {
        var replacement = '{' + i + '}';
        content = content.replace(replacement, arguments[i]);
   }
   return content;
};

class VisualEnvironmentEditor {
	constructor() {
		this.dom = null;
		this.transform = null;
		this.name = null;
		this.variation = null;
		this.enabled = false;
		this.Initialize();
	}

	Initialize () {
	    let content = $(document.createElement("div"));
		content.attr("id", "objectVisualEnvironmentEditor");

		let presetsBreadcrumbs = GetPresetBreadcrumbs();
        content.append(presetsBreadcrumbs);

        // Use the legacy category control logic for testing the legacy UI (i.e. tab-based) method of category selection
        let useLegacyCategoryControlLogic = true;

        let presetSelector = GetPresetSelector();

        content.append(presetSelector);

        let categoryOptions = ["Info", /*"Presets"*/];
        let supportedCategories = [
            "CameraParams",
            "CharacterLighting",
            "ColorCorrection",
            "DamageEffect",
            "Dof",
            "DynamicAO",
            "DynamicEnvmap",
            "Enlighten",
            "FilmGrain",
            "Fog",
            "LensScope",
            "MotionBlur",
            "OutdoorLight",
            "PlanarReflection",
            "ScreenEffect",
            "Sky",
            "SunFlare",
            "Tonemap",
            "Vignette",
            "Wind"
        ];

        // Append supportedCategories to categoryOptions
        categoryOptions.push.apply(categoryOptions, supportedCategories);
        let categoryControl = GetCategoryControl();

        content.append(categoryControl);

        let categoryControlGroup = $(document.createElement("div"));

        categoryControlGroup.attr({
            "id": "content",
            "class": "category-control-group ui-widget-content",
            "hidden": true
        });

        InitCategoryControlGroup();
        UpdateCategoryControlGroup("Info");
		content.append(categoryControlGroup);

//		this.category = categorySelect;
		this.category = categoryControl;

		function GetPresetBreadcrumbs(){
		    let presetsBreadcrumbs = $(document.createElement("div"));
            presetsBreadcrumbs.attr({
                "id": "presetsBreadcrumbs",
            });
            let presetsOverview = $(document.createElement("a"));
            presetsOverview.attr({
                "id": "presetsOverview",
            });
            presetsOverview.text('Presets');
            $(document).on('click', '#presetsOverview', function(){
                $('#savedPresets, #tabs, #content, #presetsView, .presetsBreadcrumbsSeparator, #componentView').hide();
                if ($(this).hasClass('editingPresets')){
                    $('#savedPresets').show();
                }
                else {
                    $('#tabs').show();
                }

            });
            let presetsBreadcrumbsSeparator1 = $(document.createElement("span"));
            presetsBreadcrumbsSeparator1.attr({
                "id": "presetsBreadcrumbsSeparator1",
                "class": "presetsBreadcrumbsSeparator",
                "style": "display:none;"
            });
            presetsBreadcrumbsSeparator1.text(' / ');
            let presetsView = $(document.createElement("a"));
            presetsView.attr({
                "id": "presetsView",
                "onclick": "$('#content, #presetsBreadcrumbsSeparator2, #componentView').hide(); $('#presetsView, #tabs').show();",
            });
            let presetsBreadcrumbsSeparator2 = $(document.createElement("span"));
            presetsBreadcrumbsSeparator2.attr({
                "id": "presetsBreadcrumbsSeparator2",
                "class": "presetsBreadcrumbsSeparator",
                "style": "display:none;"
            });
            presetsBreadcrumbsSeparator2.text(' / ');
            let componentView = $(document.createElement("a"));
            componentView.attr({
                "id": "componentView",
            });
            presetsBreadcrumbs.append(presetsOverview);
            presetsBreadcrumbs.append(presetsBreadcrumbsSeparator1);
            presetsBreadcrumbs.append(presetsView);
            presetsBreadcrumbs.append(presetsBreadcrumbsSeparator2);
            presetsBreadcrumbs.append(componentView);

            return presetsBreadcrumbs;
        }

        function GetPresetSelector(){
            let presetSelector = $(document.createElement("ul"));
            presetSelector.attr({
                "id": "savedPresets",
                "hidden": true
            });
            let placeholderPresetCount = 3;
            for (var i=0; i< placeholderPresetCount; i++) {
                console.log("creating preset placeholder");
                let placeholderPresetName = "PresetName{0}".format(i+1);
                let placeholderPresetPriority = placeholderPresetCount - i;

                let presetPlaceholderTab = $(document.createElement("li"));
                let presetPlaceholderTabLink = $(document.createElement("a"));
                presetPlaceholderTabLink.attr({
                    "href": "#{0}".format(placeholderPresetCount),
                    "onclick": "console.log('{0} clicked. Load its data.'); $('#presetsView').text('{1}'); $('#tabs, #presetsBreadcrumbsSeparator1, #presetsView').show();  $('#savedPresets, #content, #EditPreset').hide();".format(placeholderPresetName, placeholderPresetName),
                });
                presetPlaceholderTabLink.text("{0} {1}".format(placeholderPresetPriority, placeholderPresetName));
                presetPlaceholderTab.append(presetPlaceholderTabLink);
                presetSelector.append(presetPlaceholderTab);
                console.log("created preset placeholder");
            }
            let presetsTabContent = GetPresetsTabContent();
            let presetButtonContainer = $(document.createElement("div"));
            presetButtonContainer.attr({
                "id": "presetButtonContainer",
            });
            let addPresetButton = $(document.createElement("button"));
            addPresetButton.attr({
                "id": "AddPreset",
                "onclick": "console.log('AddPresetButton clicked.'); $('#Presets').show();",
            });
            addPresetButton.text("+ Add Preset");
            presetButtonContainer.append(addPresetButton);
            let closePresetsButton = $(document.createElement("button"));
            closePresetsButton.attr({
                "id": "ClosePresets",
                "onclick": "console.log('ClosePresetButton clicked.'); $('#presetsOverview').toggleClass('editingPresets'); $('#savedPresets').hide(); $('#tabs, #EditPreset').show();",
            });
            closePresetsButton.text("Close Saved Presets");
            presetButtonContainer.append(closePresetsButton);
            presetSelector.append(presetButtonContainer);
//            let presetsTab = $(document.createElement("li"));
//            let presetsTabLink = $(document.createElement("a"));
//            presetsTabLink.attr({
//                "href": "#Presets",
//                "onclick": "UpdateCurrentPreset()",
//            });
//            presetsTabLink.text("Presets");
//            presetsTab.append(presetsTabLink);
//            categoryControl.append(presetsTab);

            return presetSelector;
        }

        function GetCategoryControl(){
            // This is a placeholder function to be used while we get the categoryControl logic working

            let categoryControl = $(document.createElement("ul"));
            categoryControl.attr({
                "id": "tabs",
                // "hidden": true
            });

            let currentPreset = $(document.createElement("li"));
            currentPreset.attr({
                "id": "currentPreset",
            });

            categoryControl.append(currentPreset);

            let infoTab = $(document.createElement("li"));
            let infoTabLink = $(document.createElement("a"));
            infoTabLink.attr({
                "href": "#Info",
            });
            infoTabLink.text("Info");
            infoTab.append(infoTabLink);
            let editPresetsButton = $(document.createElement("button"));
            editPresetsButton.attr({
                "id": "EditPreset",
                "onclick": "console.log('EditButton clicked.'); $('#tabs').hide(); $('#presetsOverview').toggleClass('editingPresets'); $('#savedPresets').show();",
            });
            editPresetsButton.text("Edit Presets");
            infoTab.append(editPresetsButton);

            // Commenting out presetsTab for now, while it is being migrated to the savedPresets containing.
            // Delete this code after it has been successfully migrated.
//            let presetsTab = $(document.createElement("li"));
//            let presetsTabLink = $(document.createElement("a"));
//            presetsTabLink.attr({
//                "href": "#Presets",
//                "onclick": "UpdateCurrentPreset()",
//            });
//            presetsTabLink.text("Presets");
//            presetsTab.append(presetsTabLink);

            categoryControl.append(infoTab);
//            categoryControl.append(presetsTab);

            return categoryControl;
        }

		function GetInfoTabContent(){
            let tabContent = $(document.createElement("div"));
		    tabContent.attr({"id": "Info"});

		    let placholderText = $(document.createElement("div"));
            placholderText.html("<pre>Controls:\n" +
                "\n" +
                "F1 to enable freecam.\n" +
                "\n" +
                "Once in freecam, hold right click and:\n" +
                "\n" +
                "    F2 to disable freecam and take control of your character again\n" +
                "    WASD to move camera\n" +
                "    Mouse to rotate camera\n" +
                "    Q to move down\n" +
                "    E to move up\n" +
                "    Shift to move camera faster\n" +
                "    Scrollwheel to change camera speed\n" +
                "    Page up/down to change rotation speed\n" +
                "\n" +
                "In freecam, without holding right click:\n" +
                "\n" +
                "    CTRL while moving gizmo to snap to grid\n" +
                "    F to place object where the mouse is at (screen to world)\n" +
                "    Q to hide gizmo\n" +
                "    W to change gizmo mode to translate\n" +
                "    E to change gizmo mode to rotate\n" +
                "    R to change gizmo mode to scale\n" +
                "    X to toggle world/local coordinates\n" +
                "    F3 to reset the camera\n" +
                "    P to select parent\n" +
                "    CTRL+D to clone selected entity to the same directory\n" +
                "    CTRL+SHIFT+D to clone selected entity to the root directory\n" +
                "    CTRL+C to copy selected entity\n" +
                "    CTRL+V to paste saved entity to the selected group\n\n" +
                "ToDo list for CinematicTools Yo</pre>");
            
            tabContent.append(placholderText);
            // let fieldTestHolder = $(document.createElement("div"));
            // let p_Class = 'testClass';
            // let p_Field = 'testField';
            // let p_Type = 'testField';
            // let p_Value = 10;
            // let sliderField = CreateFloat(p_Class, p_Field, p_Type, p_Value);
            // fieldTestHolder.append(sliderField);
            // tabContent.append(fieldTestHolder);

		    return tabContent;
        }

        function GetPresetsTabContent(){
            let tabContent = $(document.createElement("div"));
		    tabContent.attr({
		    "id": "Presets",
		    "hidden": true
		    });

            let presetHolder = $(document.createElement("div"));
            presetHolder.attr({"id": "presetHolder"});

            presetHolder.attr({
            "id": "PresetHolder",
//            "hidden": true
            });

            let presetNameLabel = $(document.createElement("label"));
            presetNameLabel.attr({"for": "PresetName"});
            presetNameLabel.text("Preset Name:");
            presetHolder.append(presetNameLabel);


            let presetNameInput = $(document.createElement("input"));
            presetNameInput.attr({
                "id": "PresetName",
                "type": "text",
                "value": "CustomPreset"
            });
            presetHolder.append(presetNameInput);

            let presetPriorityLabel = $(document.createElement("label"));
            presetPriorityLabel.attr({"for": "PresetPriority"});
            presetPriorityLabel.text("Priority (Higher are loaded last):");
            presetHolder.append(presetPriorityLabel);


            let presetPriorityInput = $(document.createElement("input"));
            presetPriorityInput.attr({
                "id": "PresetPriority",
                "type": "number",
                "value": "0"
            });
            presetHolder.append(presetPriorityInput);

            let savePendingPresetButton = $(document.createElement("button"));
            savePendingPresetButton.attr({
                "id": "SavePendingPresetButton",
                "onclick": "console.log('SavePendingPresetButton clicked.  Add the new Preset to the savedPresetHolder.'); $('#Presets').hide();"
            });
            savePendingPresetButton.text("Save Preset");
            presetHolder.append(savePendingPresetButton);

            let currentStateHolder = $(document.createElement("div"));
            currentStateHolder.attr({"id": "CurrentStateHolder"});

            let currentStateFieldset = $(document.createElement("fieldset"));
            currentStateHolder.append(currentStateFieldset);

            let currentLabel = $(document.createElement("label"));
            currentLabel.attr({"for": "current"});
            currentLabel.text("Current:");
            currentStateFieldset.append(currentLabel);


            let currentInput = $(document.createElement("input"));
            currentInput.attr({
                "id": "current",
                "type": "radio",
                "name": "radio-1",
                "onclick": "UpdateCurrentPreset(false)",
                "checked": "checked"
            });
            currentStateFieldset.append(currentInput);

            let combinedLabel = $(document.createElement("label"));
            combinedLabel.attr({"for": "combined"});
            combinedLabel.text("Full:");
            currentStateFieldset.append(combinedLabel);


            let combinedInput = $(document.createElement("input"));
            combinedInput.attr({
                "id": "combined",
                "type": "radio",
                "name": "radio-1",
                "onclick": "UpdateCurrentPreset(true)",
            });
            currentStateFieldset.append(combinedInput);

            let currentStateTextArea = $(document.createElement("textarea"));
            currentStateTextArea.attr({
                "id": "CurrentState",
                "onclick": "this.focus();this.select()",
                "readonly": "readonly",
            });
            currentStateHolder.append(currentStateTextArea);

            tabContent.append(presetHolder);
            tabContent.append(currentStateHolder);

            return tabContent;
        }

		function GetControlGroupContent(category){
		    /*
		    This function returns the content for the selected category option
		    */

		    let controlGroupContent = "";
		    let controlGroupMap = new Map([
		        ["Info", GetInfoTabContent],
		        ["Presets", GetPresetsTabContent]
		    ]);

		    if (controlGroupMap.has(category)) {
		        controlGroupContent = controlGroupMap.get(category);
		        if(typeof controlGroupContent === "function") {
		            // If the returned value is a function, call that function to get the contents
		            controlGroupContent = controlGroupContent();
		        }
		    }
		    else {
		        // Display category control group for the category
		        if (category === null) {
                    category = "selected";
                }
                // controlGroupContent = controlGroupContent.format(category);
                let tabContent = $(document.createElement("div"));
                tabContent.attr({"id": category});

                let placholderText = $(document.createElement("div"));
                placholderText.text(controlGroupContent);
                tabContent.append(placholderText);
                controlGroupContent = tabContent;
		    }
		    return controlGroupContent;
		}

        function InitCategoryControlGroup() {
		    // Empty the categoryControlGroup element, and then populate it with tab contents
            categoryControlGroup.empty();
            categoryOptions.forEach(function(newCategoryName, index){
                let newTabContent = GetControlGroupContent(newCategoryName);
                if (typeof newTabContent === 'string') {
                    let placholderText = $(document.createElement("div"));
                    newTabContent = placholderText.text(newTabContent);
                }
                categoryControlGroup.append(newTabContent);
                // This is a hack
                // TODO: Create a generic way to call a function or functions for a tab once its content has loaded
                // .load() might work
                if (newCategoryName === "Presets") {
                    UpdateCurrentPreset();
                }
            });
		}

		function UpdateCategoryControlGroup(newCategoryName) {
		    // Hide all of the categoryControlGroup element contents, and then show the contents of the selected tab
            let allTabContent = categoryControlGroup.children();
            allTabContent.hide();

            // This is a hack
            // TODO: Create a generic way to call a function or functions for a tab once its content has loaded
            // .load() might work
            if (newCategoryName === "Presets") {
                UpdateCurrentPreset();
            }
            // let selectedTab = "#{0}".format(newCategoryName);
            // allTabContent.filter(selectedTab).show();

            let selectedTab = $("#{0}".format(newCategoryName));
            selectedTab.show();
            // $('html, body').animate({
            //     scrollTop: $('#objectVisualEnvironmentEditor').offsetTop //#Scroll to the top of the objectVisualEnvironmentEditor
            // }, 'slow');

		}

        $(document).on("click", "ul#tabs li a", function(event){
            // $this is the categorySelect element that fired the change event
            let $this = this;
            let newCategoryName = $this.text;
            $('#content, #presetsBreadcrumbsSeparator2, #componentView').show();
            $('#savedPresets, #tabs').hide();
            $('#componentView').text(newCategoryName);
            UpdateCategoryControlGroup(newCategoryName);
            // TODO: Scroll the selected tab to the top
            // $('#objectVisualEnvironmentEditor').scrollTop($('#objectVisualEnvironmentEditor').offset().bottom);
            // $('#objectVisualEnvironmentEditor').scrollTop(0);
            if (editor.selectionGroup.children.length === 0){ return;}
            editor.execute(new SetObjectNameCommand(editor.selectionGroup.children[0].guid, newCategoryName));
        });

		this.dom = content;
	}
}

var VisualEnvironmentEditorComponent = function( container, state ) {
	this._container = container;
	this._state = state;
	this.element = new VisualEnvironmentEditor();

	this._container.getElement().html(this.element.dom);
};

// The following code is a copy/paste from CinematicTools/WebUI/scripts/script.js
// TODO: Figure out if it should be moved to another file.

var m_CurrentPreset = {};
var m_FullPreset = {"Name": "", "Priority": ""};
var m_OriginalPreset = {};
var m_Enums = {};
var m_VectorNames = ["x", "y", "z", "w"];

var currentFocus = null;


var m_IsIngame = true;
var m_IsCombied = false;

var m_CurrentlyUpdating = false


var debugconsole = document.getElementById("console")

function Debug(string) {
    var node = document.createElement("li"); // Create a <li> node
    var textnode = document.createTextNode(string); // Create a text node
    node.appendChild(textnode);
    debugconsole.appendChild(node);
}

function SendUpdate(p_Class, p_Field, p_Type, p_Value) {
    // Make sure that we don't send updates when we're updating our sliders.
    if(m_CurrentlyUpdating) {
        return
    }
    if(p_Class == null || p_Field == null || p_Type == null || p_Value == null) {
        return
    }
    m_FullPreset[p_Class][p_Field] = p_Value;
    var Return = p_Class + ":" + p_Field + ":" + p_Type + ":" + p_Value;

    if(m_CurrentPreset[p_Class] == null) {
        m_CurrentPreset[p_Class] = {};
    }
    if(m_CurrentPreset[p_Class][p_Field] == null) {
        m_CurrentPreset[p_Class][p_Field] = {};
    }
    m_CurrentPreset[p_Class][p_Field] = p_Value;

    if(m_IsIngame) {
        WebUI.Call('DispatchEventLocal', 'CT:UpdateValue', Return);
    }
}

function SetKeyboard(p_Value) {
    if(m_IsIngame) {
        WebUI.Call('DispatchEventLocal', 'CT:SetKeyboard', p_Value);

    }
}

function AddField(p_Class, p_Field, p_Type, p_Value) {
    if (m_FullPreset[p_Class] == null) {
        CreateClass(p_Class);
    }

    if (m_FullPreset[p_Class][p_Field] == null) {
        CreateField(p_Class, p_Field, p_Type);
        CreateValue(p_Class, p_Field, p_Type, p_Value)
    } else {
        UpdateValue(p_Class, p_Field, p_Type, p_Value)
    }
}
//outdated
function UpdateValue(p_Class, p_Field, p_Type, p_Value) {
    if (p_Type == "Boolean") {
        if (p_Value == "true") {
            $("#" + p_Class + " #" + p_Field + " input[inputtype='" + p_Type + "']").attr("checked", "checked");
            //$("#"+p_Class+" #"+ p_Type+" input[name='"+ p_Field +"']" ).val(p_Value);
        } else {
            $("#" + p_Class + " #" + p_Field + " input[inputtype='" + p_Type + "']").removeAttr("checked");
        }
        return;
    }
    var s_IterationCount = 0;
    var s_Value = null;
    switch (p_Type) {
        case "Float32":
            s_IterationCount = 1;
            s_Value = {0: parseFloat(p_Value) };
            break;
        case "Vec2":
            s_IterationCount = 2;
            s_Value = ParseVec(p_Value);
            break;
        case "Vec3":
            s_IterationCount = 3;
            s_Value = ParseVec(p_Value);
            break;
        case "Vec4":
            s_IterationCount = 4;
            s_Value = ParseVec(p_Value);
            break;
        // Enum
        default:
            $("#" + p_Class + " #" + p_Field + " select").val(p_Value);
            $("#" + p_Class + " #" + p_Field + " select").selectmenu("refresh");
        return;
    }


    m_CurrentlyUpdating = true;
    for(var i = 0; i < s_IterationCount; i++) {
        sl = $("#" + p_Class + " #" + p_Field).children().eq(i);
        sl.slider({
            value: parseFloat(parseFloat(s_Value[i])),
            min: GetSliderMin(parseFloat(s_Value[i])),
            max: GetSliderMax(parseFloat(s_Value[i]))
        });
        sl.slider('option','slide')
            .call(sl,null,{ handle: $('.ui-slider-handle', sl), value: s_Value[i] });
    }
    m_CurrentlyUpdating = false;
}

function CreatePreset(p_Preset) {
    p_Preset[p_Preset] = {};

    var nodeTitle = document.createElement("h2");
    nodeTitle.innerHTML = p_Preset;

    document.getElementById("Presets").appendChild(nodeTitle);
}

function CreateClass(p_Class) {
    m_FullPreset[p_Class] = {};
    m_OriginalPreset[p_Class] = {};

    var node = document.createElement("li"); // Create a <li> node
    var link = document.createElement("a");
    link.href = "#" + p_Class;
    link.innerHTML = p_Class;
    node.appendChild(link);
    document.getElementById("tabs").appendChild(node);
    var content = document.createElement("div");
    content.id = p_Class;
    $(content).attr("name", p_Class);
    document.getElementById("content").appendChild(content);
    $("#window").tabs("refresh");
}


function CreateField(p_Class, p_Field, p_Type) {
    m_FullPreset[p_Class][p_Field] = null;
    m_OriginalPreset[p_Class][p_Field] = null;

    var nodeTitle = document.createElement("h2");
    nodeTitle.innerHTML = p_Field;

    document.getElementById(p_Class).appendChild(nodeTitle);
}

function CreateValue(p_Class, p_Field, p_Type, p_Value) {

    m_FullPreset[p_Class][p_Field] = p_Value;
    m_OriginalPreset[p_Class][p_Field] = p_Value;
    var s_ContentNode = document.createElement("div");

    switch (p_Type) {
        case "Vec2":
        case "Vec3":
        case "Vec4":
            s_ContentNode = CreateVec(p_Class, p_Field, p_Type, p_Value);
            break;
        case "Boolean":
            s_ContentNode = CreateBool(p_Field, p_Value);
            break;
        case "Float32":
            s_ContentNode = CreateFloat(p_Class, p_Field, p_Type, p_Value);
            break;
        case "TextureAsset":
        case "SurfaceShaderBaseAsset":
            s_ContentNode = NotImplemented();
            break;
        default:
            s_ContentNode = CreateEnum(p_Field, p_Type, p_Value);

            break;
    }
    if (s_ContentNode == null) {
        return;
    }



    s_ContentNode.setAttribute("name", p_Field);
    s_ContentNode.setAttribute("type", p_Type);
    s_ContentNode.id = p_Field;
    document.getElementById(p_Class).appendChild(s_ContentNode);

    $("select").selectmenu(); // hack to make all dropdowns selectmenu. I don't care.

    if (p_Field == "SunRotationY") {
        $("#OutdoorLight #SunRotationX").slider("max", 360);
        $("#OutdoorLight #SunRotationY").slider("max", 360);
    }
}

function CreateVec(p_Class, p_Field, p_Type, p_Value) {
    var s_Vec = {};
    var s_Value = ParseVec(p_Value);
    var s_ContentNode = document.createElement("div");


    for (var i = 0; i < s_Value.length; i++) {
        var ret = CreateFloat(p_Class, p_Field, p_Type, s_Value[i]);
        s_ContentNode.appendChild(ret.children[0]);
    }

    return s_ContentNode;
}

function CreateBool(p_Field, p_Value) {
    var s_ContentNode = document.createElement("div");

    var s_Bool = document.createElement("input");
    s_Bool.setAttribute("type", "checkbox");
    s_Bool.setAttribute("inputType", "Boolean");
    s_Bool.setAttribute("name", p_Field);
    if (p_Value == "true") {
        s_Bool.setAttribute("checked", "");
    }
    s_ContentNode.appendChild(s_Bool);
    return s_ContentNode;
}

function CreateFloat(p_Class, p_Field, p_Type, p_Value) {
    var s_ContentNode = document.createElement("div");

    var s_Slider = document.createElement("div");
    s_Slider.setAttribute("name", p_Type);
    s_Slider.setAttribute("inputType", p_Type);
    s_Slider.setAttribute("displayType", "slider");
    s_Slider.setAttribute("min", GetSliderMin(parseFloat(p_Value)));
    s_Slider.setAttribute("max", GetSliderMax(parseFloat(p_Value)));

    var s_Display = document.createElement("div");
    $(s_Display).attr("class", "valueDisplay");
    s_Slider.appendChild(s_Display);

    $(s_Slider).slider({
        range: "min",
        min: GetSliderMin(parseFloat(p_Value)),
        max: GetSliderMax(parseFloat(p_Value)),
        value: parseFloat(p_Value),
        step: 0.01,
        create: function() {
            $(s_Display).text($(this).slider("value"));
            if($("#" + p_Class + " #" + p_Field).length) {
                ValueUpdated(p_Class, p_Field, p_Type, $("#" + p_Class + " #" + p_Field))
            }
        },
        slide: function(event, ui) {
            $(s_Display).text(ui.value);
            ValueUpdated(p_Class, p_Field, p_Type, $("#" + p_Class + " #" + p_Field));
        },
    });

    s_ContentNode.appendChild(s_Slider);
    return s_ContentNode;
}

function CreateEnum(p_Field, p_Type, p_Value) {
    if (p_Value == "Realm") {
        return null;
    }
    var s_ContentNode = document.createElement("div");

    var s_Enum = document.createElement("select");
    s_Enum.setAttribute("name", p_Field);
    s_Enum.setAttribute("inputType", "Enum");
    for (var i = 0; i < m_Enums[p_Type].length; i++) {
        var s_Option = document.createElement("option");
        s_Option.setAttribute("value", i);
        s_Option.text = m_Enums[p_Type][i];
        if (i == p_Value) {
            s_Option.setAttribute("selected", "selected");
        }
        s_Enum.add(s_Option);
    }
    s_ContentNode.appendChild(s_Enum);
    return s_ContentNode;
}

function NotImplemented() {
    var s_ContentNode = document.createElement("div");

    var s_Float = document.createElement("label");
    s_Float.innerHTML = "Not supported";
    s_Float.setAttribute("type", "NotSupported");
    s_ContentNode.appendChild(s_Float);
    return s_ContentNode;
}

function GetSliderMax(p_Range) {
    var s_Range = 1;
    if (p_Range > 1) {
        s_Range = 10;
    }
    if (p_Range > 10) {
        s_Range = 100;
    }
    if (p_Range > 100) {
        s_Range = 1000;
    }
    if (p_Range > 1000) {
        s_Range = 10000;
    }
    if (p_Range > 10000) {
        s_Range = 100000;
    }
    return s_Range
}

function GetSliderMin(p_Range) {
    var s_Range = 0;
    if (p_Range < 0 && p_Range > -1) {
        s_Range = -1;
    }
    if (p_Range < -1) {
        s_Range = -10;
    }
    if (p_Range < -10) {
        s_Range = -100;
    }
    if (p_Range < -100) {
        s_Range = -1000;
    }
    if (p_Range < -1000) {
        s_Range = -10000;
    }
    if (p_Range < -10000) {
        s_Range = -100000;
    }
    return s_Range
}


function ParseVec(p_Vec) {

    var s_Vec = p_Vec.replace(/\(|\)| /g, '');
    s_Vec = s_Vec.split(",");

    var s_Ret = [];
    for (var i = 0; i < s_Vec.length; i++) {
        s_Ret[i] = s_Vec[i]
    }
    return s_Ret;
}

function ParseBoolean(p_Value) {
    switch (p_Value) {
        case "true":
            return true;
            break;
        default:
            return false;
            break;
    }
}

function ParseEnum(p_Type, p_Value) {
    if (m_Enums[p_Type] != null) {
        return m_Enums[p_Type][parseInt(p_Value)];
    }
}

function AddEnum(p_Type, p_Value) {
    var s_Enums = p_Value.split(":")
    s_Enums.splice(s_Enums.length - 1, 1);
    m_Enums[p_Type] = s_Enums;
}



$(document).on('selectmenuchange', 'select', function() {

    var s_KeyObject = $(this).parent(); //div brightness
    var s_ClassObject = s_KeyObject.parent(); //div colorcorrection
    var s_Class = $(s_ClassObject).attr("name");
    var s_Key = $(s_KeyObject).attr("name");
    var s_Type = $(s_KeyObject).attr("type");
    var s_Value = $(this).val();


    SendUpdate(s_Class, s_Key, "Enum", s_Value);

});

$(document).on('focus', 'textarea', function() {
    SetKeyboard("true");
});
$(document).on('focusout', 'textarea', function() {
    SetKeyboard("false");
});

$(document).on('focus', 'input', function() {
    SetKeyboard("true");
});
$(document).on('focusout', 'input', function() {
    SetKeyboard("false");
});

$(document).on('change', '#content input[type=\"checkbox\"]', function() {

    var s_KeyObject = $(this).parent(); //div brightness
    var s_ClassObject = s_KeyObject.parent(); //div colorcorrection
    var s_Class = $(s_ClassObject).attr("name");
    var s_Key = $(s_KeyObject).attr("name");
    var s_Type = $(s_KeyObject).attr("type");
    var s_Value = null;

    var Return = s_Class + ":" + s_Key + ":" + s_Type + ":";
    if (s_Type == "Boolean") {
        s_Value = $(this).is(':checked');

    } else {
        s_Value = $(this).val()

    }

    SendUpdate(s_Class, s_Key, s_Type, s_Value);
});


$(document).on('contextmenu', '.ui-slider-handle', function() {
    var s_KeyObject = $(this).parent().parent(); //div brightness
    var s_ClassObject = s_KeyObject.parent(); //div colorcorrection
    var s_Class = $(s_ClassObject).attr("name");
    var s_Key = $(s_KeyObject).attr("name");
    var s_SubKey = $(this).parent().attr("name");
    var s_Type = $(s_KeyObject).attr("type");

    var s_Parent = $(this).parent();
    var s_Value = s_Parent.slider("value");
    s_Parent.attr("value", s_Value);
    s_Parent.attr("type", "number");
    s_Parent.slider("destroy");
    s_Parent.changeElementType("input");
    // currentFocus = $("#" + s_Class + " #" + s_Key + " input");
    currentFocus = s_Parent;
    currentFocus.focus();
    currentFocus.select();
    SetKeyboard("true");
});

function SetToSlider(p_Element) {
    var s_Val = $(p_Element).val();
    var s_Class = $(p_Element).parent().parent().attr("name");
    var s_Field = $(p_Element).parent().attr("name");
    var s_Type = $(p_Element).parent().attr("type");
    var s_Min = $(p_Element).attr("min");
    var s_Max = $(p_Element).attr("max");
    var s_Element = $(p_Element).changeElementType("div");
    $(s_Element).slider({
        range: "min",
        min: GetSliderMin(parseFloat(s_Val)),
        max: GetSliderMax(parseFloat(s_Val)),
        value: parseFloat(s_Val),
        step: 0.01,
        create: function() {
            $(this).children(".valueDisplay").text($(this).slider("value"));
            ValueUpdated(s_Class, s_Field, s_Type, $("#" + s_Class + " #" + s_Field));
        },
        slide: function(event, ui) {
            $(this).children(".valueDisplay").text(ui.value);
            ValueUpdated(s_Class, s_Field, s_Type, $("#" + s_Class + " #" + s_Field));
        }
    });
    SetKeyboard("false");
}

function ValueUpdated(p_Class, p_Field, p_Type, p_KeyObject) {
    var s_Value = null;
    if (p_Type == "Boolean") {
        s_Value = $(p_KeyObject).is(':checked');
    }
    if (p_Type == "Float32") {
        s_Value = $(p_KeyObject).children(0).children(".valueDisplay").text();
    }
    if (p_Type == "Vec3" || p_Type == "Vec2" || p_Type == "Vec4") {
        s_Value = "";
        $(p_KeyObject).children('div').each(function() {
            s_Value += $(this).children(".valueDisplay").text() + ":";
        });
    }
    SendUpdate(p_Class, p_Field, p_Type, s_Value);
};

$(document).on('focusout', '#content input[displayType="slider"]', function() {
    SetToSlider(this);
});

$(document).on('keyup', '#content input[displayType="slider"]', function(e) {
    if (e.keyCode == 13) {
        $(this).blur();
        SetToSlider(this);
    }
});


$(document).on('change', '#presetHolder input', function() {
    UpdateCurrentPreset()
});

function UpdateCurrentPreset(p_PresetType) {
    if (p_PresetType != null) {
        m_IsCombied = p_PresetType
    }

    var s_CurrentState = "";

    m_CurrentPreset['Name'] = $('#PresetName').val();
    m_CurrentPreset['Priority'] = $('#PresetPriority').val();

    m_FullPreset['Name'] = m_CurrentPreset['Name']
    m_FullPreset['Priority'] = m_CurrentPreset['Priority'];

    var prefix =    'class "' + m_CurrentPreset['Name'] +'"\n' +
                    'local table = [[\n';

    var suffix = '\n]]\n\n\n' +
        'function '+ m_CurrentPreset['Name'] +  ':GetPreset()\n' +
        '  return table\n' +
        'end\n' +
        '\n' +
        'return ' + m_CurrentPreset['Name'];

    $("#CurrentState").text(prefix);

    if(m_IsCombied) {
        $("#CurrentState").text($("#CurrentState").text() + JSON.stringify(m_FullPreset, null, 4));
    } else {
        $("#CurrentState").text($("#CurrentState").text() + JSON.stringify(m_CurrentPreset, null, 4));
    }

    $("#CurrentState").text($("#CurrentState").text() + suffix);
    return $("#CurrentState").text();
}


(function($) {
    $.fn.changeElementType = function(newType) {
        var newElements = [];

        $(this).each(function() {
            var attrs = {};

            $.each(this.attributes, function(idx, attr) {
                attrs[attr.nodeName] = attr.nodeValue;
            });

            var newElement = $("<" + newType + "/>", attrs).append($(this).contents());

            $(this).replaceWith(newElement);

            newElements.push(newElement);
        });

        return $(newElements);
    };
})(jQuery);


$(document).ready(function () {
    if (window.location.href.indexOf("webui") == -1) {
        m_IsIngame = false;
    }
});

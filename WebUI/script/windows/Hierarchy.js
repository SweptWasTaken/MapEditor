
class Hierarchy {
	constructor() {
		signals.spawnedBlueprint.add(this.onSpawnedBlueprint.bind(this));
		signals.destroyedBlueprint.add(this.onDestroyedBlueprint.bind(this));
		signals.createdGroup.add(this.onCreatedGroup.bind(this));
		signals.destroyedGroup.add(this.onDestroyedGroup.bind(this));
		signals.selectedGameObject.add(this.onSelectedGameObject.bind(this));
		signals.deselectedGameObject.add(this.onDeselected.bind(this));
		signals.setObjectName.add(this.onSetObjectName.bind(this));
		signals.levelLoaded.add(this.onLevelLoaded.bind(this));


		this.data = {
			"name": "Root",
			"id": "root",
			"TypeName": "Root",
			"Parent": "root",
			"children": [
			]
		}


		this.dom = this.CreateDom();
		this.tree = this.InitializeTree();
		this.topControls = this.CreateTopControls();
		this.subControls = this.CreateSubControls();

		this.entries = [];
		this.Initialize();

		this.queue = [];

		this.filterOptions = {
			caseSensitive: false,
			exactMatch: false,
			includeAncestors: true,
			includeDescendants: true
		};
	}



	onSpawnedBlueprint(command) {
		let scope = this;
		let gameObject = editor.getGameObjectByGuid(command.guid);

		let currentEntry = gameObject.getNode();
		scope.entries[command.guid] = currentEntry;

		this.queue[currentEntry.id] = currentEntry;

		if(!editor.vext.executing) {
			console.log("Drawing");
			console.log(this.queue.length);

			let updatedNodes = {};
			let missingParent = {};

			for( let entryGuid in scope.queue) {
				let entry = scope.queue[entryGuid];
				//Check if the parent is in the queue
				if(this.queue[entry.parentId] != null) {
					this.queue[entry.parentId].children.push(entry);
					entry.parent = this.queue[entry.parentId];
				} else if(this.tree.getNodeById(entry.parentId) != null) {
					let parentNode = this.tree.getNodeById(entry.parentId);
					parentNode.children.push(scope.queue[entryGuid]);
					updatedNodes[entry.parentId] = parentNode;
					entry.parent = parentNode;
				} else {
					let parentNode = this.tree.getNodeById("root");
					parentNode.children.push(scope.queue[entryGuid]);
					updatedNodes[entry.parentId] = parentNode;
					entry.parent = parentNode;
				}
			}
			scope.queue = {};
			for(let parentNodeId in updatedNodes) {
				let parentNode = updatedNodes[parentNodeId];
				scope.tree.updateNode(parentNode);
			}

		}
	}

	getEntry(guid) {
		return this.entries[guid];
	}

	onDestroyedBlueprint(command) {
		let scope = this;
		let parent = command.parent;

		//TODO: remove parent's reference in parent.children once groups are implemented

		let node = scope.tree.getNodeById(command.guid);
		if (node !== null || node != undefined){
			scope.tree.removeNode(node);
		}
		
	}

	onCreatedGroup(command) {
		let scope = this;
		let parent = command.parent;
		//		scope.dom.jstree(true).create_node("root", new HierarchyEntry(command.guid, command.name, command.type), "last");
		let entry = new HierarchyEntry(command.guid, command.name, "", scope.data.children.length, "root");
		scope.entries[command.guid] = entry;
		scope.data.children[scope.data.children.length] = entry;
		scope.dom.jstree(true).create_node('root' ,  entry, "last", function(){
		});

	}
	onLevelLoaded(levelData) {
		let scope = this;
		let levelEntry = {
			id: levelData.instanceGuid,
			name: levelData.name,
			type: "LevelData",
			state: {
				open: true
			},
			selectable: false,
			children: []
		};
		this.data.children.push(levelEntry);
		scope.tree.loadData(this.data)
	}

	onDestroyedGroup(command) {

	}

	onSetObjectName(command) {
		let scope = this;
		let node = scope.dom.jstree(true).get_node(command.guid);
		if (node !== null || node !== undefined){

			scope.dom.jstree(true).rename_node(node, command.name);
		}
	}

	Initialize() {
		let scope = this;
		scope.tree.on('selectNode', function(node) {
			console.log(node);
			// → Node {} (The selected node)
			// → null (No nodes selected)
		});
		// TODO: Implement node refresh logic here somewhere;
	}
	LoadData(data) {
		let scope = this;
		scope.data.children.push(data);
		console.log(scope.data);
		scope.tree.updateNode(scope.tree.getNodeById("root", {}, undefined))

	}
	InitializeTree() {
		let scope = this;
		return new InfiniteTree({
			el: scope.dom,
			data: scope.data,
			rowRenderer: scope.hierarchyRenderer,
			autoOpen: true, // Defaults to false
			droppable: { // Defaults to false
				hoverClass: 'infinite-tree-droppable-hover',
				accept: function(event, options) {
					return true;
				},
				drop: function(event, options) {
				}
			},
			shouldSelectNode: function(node) { // Determine if the node is selectable
				console.log(node);

				if(node == null) {
					return false;
				}
				if(node.selectable === false) {
					return false;
				}
				if (!node || (node === scope.tree.getSelectedNode())) {
					return false; // Prevent from deselecting the current node
				}
				if(editor.isSelected(node.id)) {
					return true;
				}
				editor.Select(node.id, keysdown[17]);
			},
			togglerClass: "Toggler",
			nodeIdAttr: "guid"

		});
	}

	CreateDom() {
		return new UI.Panel().dom;
	}


	CreateTopControls() {
		let scope = this;
		let dom = $(document.createElement("div"));
		dom.addClass("contentControls");
		let searchInput = $(document.createElement("input"));
		searchInput.attr("placeholder", "Search");
		dom.append(searchInput);

		var to = false;
		searchInput.keyup(function () {
			if(to) { clearTimeout(to); }
			to = setTimeout(function () {
				let v = searchInput.val();
				scope.tree.filter(v, scope.filterOptions);
			}, 250);
		});


		return dom;
	}

	check_callback(op, node, par, pos, more) {
		if(op === "move_node" ) {
			let child = editor.getGameObjectByGuid(node.id);
			let parent = editor.getGameObjectByGuid(par.id);

			if (child === undefined || parent === undefined || parent.type !== "Group" || child.type === "GameEntity"){
				return false;
			}
		}
	}

	CreateSubControls() {
		let dom = $(document.createElement("div"));
		return dom;
	}


	onMoved(nodeData) {
		let scope = this;
		// TODO: update data with the changes
		let child = editor.getGameObjectByGuid(nodeData.node.id);
		let parent = editor.getGameObjectByGuid(nodeData.parent);
	}

	onSelectedGameObject(guid, isMultipleSelection) {
		let scope = this;
		let node = scope.tree.getNodeById(guid);
		scope.ExpandToNode(node);

		scope.tree.selectNode(node, {
			autoScroll: true,
			silent: true
		});
	}

	ExpandToNode(node) {
		let scope = this;
		if(node == null) {
			return;
		}
		if(node.parent.id != null) {
			scope.tree.openNode(node.parent);
			scope.ExpandToNode(node.parent);
		}
	}

	onDeselected(guid) {
		let scope = this;
		//let node = scope.dom.jstree(true).get_node(guid);
		//this.dom.jstree(true).deselect_node(node);
	}

	hierarchyRenderer(node, treeOptions) {
		if(node.state.filtered === false){
			return
		}
		let state = node.state;
		let row = new UI.Row();
		row.setAttribute("guid", node.id);
		row.setStyle("margin-left", (state.depth * 18) +"px");
		row.addClass("infinite-tree-item");

		if(state.selected) {
			row.addClass("infinite-tree-selected");
		}
		if(node.selectable !== undefined) {
			row.setAttribute("node-selectable", node.selectable);
		}

		if(node.draggable) {
			row.setAttribute("draggable", true);
		}
		if(node.droppable) {
			row.setAttribute("droppable", true);
		}
		if(node.hasChildren()) {
			row.add(new UI.Toggler(state.open));
		}
		row.add(new UI.Icon(node.type));
		row.add(new UI.Text(node.name));
		if(Object.keys(node.children).length > 0) {
			let count = new UI.Text(Object.keys(node.children).length);
			row.add(count);
			count.setStyle("padding-left", "10px");
			count.setStyle("opacity", "0.5");
		}
		
		$(row).on('click', function (e) {
			console.log(e);
		});
		return row.dom.outerHTML;
	}
}

var HierarchyComponent = function( container, state ) {
	this._container = container;
	this._state = state;
	this.element = new Hierarchy();

	this._container.getElement().append(this.element.topControls);
	this._container.getElement().append(this.element.dom);

};


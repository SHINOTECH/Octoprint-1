function SettingsViewModel(loginStateViewModel, usersViewModel, printerProfilesViewModel) {
    var self = this;

    self.loginState = loginStateViewModel;
    self.users = usersViewModel;
    self.printerProfiles = printerProfilesViewModel;

    self.api_enabled = ko.observable(undefined);
    self.api_key = ko.observable(undefined);
    self.api_allowCrossOrigin = ko.observable(undefined);
    
    self.fastbot_firmwareVersion = ko.observable(undefined);
    self.fastbot_staticIPAddress = ko.observable(undefined);
    self.fastbot_staticIPNetmask = ko.observable(undefined);
    self.fastbot_staticIPGateWay = ko.observable(undefined);

    self.appearance_name = ko.observable(undefined);
    self.appearance_color = ko.observable(undefined);

    self.appearance_available_colors = ko.observable([
        {key: "default", name: gettext("default")},
        {key: "red", name: gettext("red")},
        {key: "orange", name: gettext("orange")},
        {key: "yellow", name: gettext("yellow")},
        {key: "green", name: gettext("green")},
        {key: "blue", name: gettext("blue")},
        {key: "violet", name: gettext("violet")},
        {key: "black", name: gettext("black")}
    ]);

    self.appearance_colorName = function(color) {
        switch (color) {
            case "red":
                return gettext("red");
            case "orange":
                return gettext("orange");
            case "yellow":
                return gettext("yellow");
            case "green":
                return gettext("green");
            case "blue":
                return gettext("blue");
            case "violet":
                return gettext("violet");
            case "black":
                return gettext("black");
            case "default":
                return gettext("default");
            default:
                return color;
        }
    };

    self.printer_defaultExtrusionLength = ko.observable(undefined);

    self.webcam_streamUrl = ko.observable(undefined);
    self.webcam_snapshotUrl = ko.observable(undefined);
    self.webcam_ffmpegPath = ko.observable(undefined);
    self.webcam_bitrate = ko.observable(undefined);
    self.webcam_watermark = ko.observable(undefined);
    self.webcam_flipH = ko.observable(undefined);
    self.webcam_flipV = ko.observable(undefined);

    self.feature_gcodeViewer = ko.observable(undefined);
    self.feature_temperatureGraph = ko.observable(undefined);
    self.feature_waitForStart = ko.observable(undefined);
    self.feature_alwaysSendChecksum = ko.observable(undefined);
    self.feature_pingPong = ko.observable(undefined);
    self.feature_sdSupport = ko.observable(undefined);
    self.feature_sdAlwaysAvailable = ko.observable(undefined);
    self.feature_swallowOkAfterResend = ko.observable(undefined);
    self.feature_repetierTargetTemp = ko.observable(undefined);

    self.serial_port = ko.observable();
    self.serial_baudrate = ko.observable();
    self.serial_portOptions = ko.observableArray([]);
    self.serial_baudrateOptions = ko.observableArray([]);
    self.serial_autoconnect = ko.observable(undefined);
    self.serial_timeoutConnection = ko.observable(undefined);
    self.serial_timeoutDetection = ko.observable(undefined);
    self.serial_timeoutCommunication = ko.observable(undefined);
    self.serial_timeoutTemperature = ko.observable(undefined);
    self.serial_timeoutSdStatus = ko.observable(undefined);
    self.serial_log = ko.observable(undefined);

    self.folder_uploads = ko.observable(undefined);
    self.folder_timelapse = ko.observable(undefined);
    self.folder_timelapseTmp = ko.observable(undefined);
    self.folder_logs = ko.observable(undefined);
    self.folder_watched = ko.observable(undefined);

    self.cura_enabled = ko.observable(undefined);
    self.cura_path = ko.observable(undefined);
    self.cura_config = ko.observable(undefined);

    self.temperature_profiles = ko.observableArray(undefined);

    self.system_actions = ko.observableArray([]);

    self.terminalFilters = ko.observableArray([]);

    self.settings = undefined;

    self.fromFastBotData = function(data) {
        var type = data["type"];
        var payload = data["payload"];
        if (payload.type == "firmwareVersion") {
            self.fastbot_firmwareVersion(payload.firmwareVersion);
         }
    };  

    self.addTemperatureProfile = function() {
        self.temperature_profiles.push({name: "New", extruder:0, bed:0});
    };

    self.removeTemperatureProfile = function(profile) {
        self.temperature_profiles.remove(profile);
    };

    self.addTerminalFilter = function() {
        self.terminalFilters.push({name: "New", regex: "(Send: M105)|(Recv: ok T:)"})
    };

    self.removeTerminalFilter = function(filter) {
        self.terminalFilters.remove(filter);
    };

    self.onSettingsShown = function() {
      self.requestData();
    };
     
    self.requestData = function(callback) {
        $.ajax({
            url: API_BASEURL + "settings",
            type: "GET",
            dataType: "json",
            success: function(response) {
                self.fromResponse(response);
                if (callback) callback();
            }
        });
    };

    self.fromResponse = function(response) {
        if (self.settings === undefined) {
            self.settings = ko.mapping.fromJS(response);
        } else {
            ko.mapping.fromJS(response, self.settings);
        }

        self.api_enabled(response.api.enabled);
        self.api_key(response.api.key);
        self.api_allowCrossOrigin(response.api.allowCrossOrigin);

        self.appearance_name(response.appearance.name);
        self.appearance_color(response.appearance.color);

        self.printer_defaultExtrusionLength(response.printer.defaultExtrusionLength);

        self.webcam_streamUrl(response.webcam.streamUrl);
        self.webcam_snapshotUrl(response.webcam.snapshotUrl);
        self.webcam_ffmpegPath(response.webcam.ffmpegPath);
        self.webcam_bitrate(response.webcam.bitrate);
        self.webcam_watermark(response.webcam.watermark);
        self.webcam_flipH(response.webcam.flipH);
        self.webcam_flipV(response.webcam.flipV);

        self.feature_gcodeViewer(response.feature.gcodeViewer);
        self.feature_temperatureGraph(response.feature.temperatureGraph);
        self.feature_waitForStart(response.feature.waitForStart);
        self.feature_alwaysSendChecksum(response.feature.alwaysSendChecksum);
        self.feature_sdSupport(response.feature.sdSupport);
        self.feature_sdAlwaysAvailable(response.feature.sdAlwaysAvailable);
        self.feature_swallowOkAfterResend(response.feature.swallowOkAfterResend);
        self.feature_repetierTargetTemp(response.feature.repetierTargetTemp);

        self.serial_port(response.serial.port);
        self.serial_baudrate(response.serial.baudrate);
        self.serial_portOptions(response.serial.portOptions);
        self.serial_baudrateOptions(response.serial.baudrateOptions);
        self.serial_autoconnect(response.serial.autoconnect);
        self.serial_timeoutConnection(response.serial.timeoutConnection);
        self.serial_timeoutDetection(response.serial.timeoutDetection);
        self.serial_timeoutCommunication(response.serial.timeoutCommunication);
        self.serial_timeoutTemperature(response.serial.timeoutTemperature);
        self.serial_timeoutSdStatus(response.serial.timeoutSdStatus);
        self.serial_log(response.serial.log);

        self.folder_uploads(response.folder.uploads);
        self.folder_timelapse(response.folder.timelapse);
        self.folder_timelapseTmp(response.folder.timelapseTmp);
        self.folder_logs(response.folder.logs);
        self.folder_watched(response.folder.watched);

        self.cura_enabled(response.cura.enabled);
        self.cura_path(response.cura.path);
        self.cura_config(response.cura.config);

        self.temperature_profiles(response.temperature.profiles);

        self.system_actions(response.system.actions);

        self.terminalFilters(response.terminalFilters);
        //lkj
        self.fastbot_firmwareVersion(response.fastbotArgs.firmwareVersion);
        self.fastbot_staticIPAddress(response.fastbotArgs.staticIPAddress);
        self.fastbot_staticIPNetmask(response.fastbotArgs.staticIPNetmask);
        self.fastbot_staticIPGateWay(response.fastbotArgs.staticIPGateWay);
    };

    self.saveData = function() {
        var data = ko.mapping.toJS(self.settings);

        data = _.extend(data, {
            "api" : {
                "enabled": self.api_enabled(),
                "key": self.api_key(),
                "allowCrossOrigin": self.api_allowCrossOrigin()
            },
            /*"fastbotArgs" : {
                "firmwareVersion": self.fastbot_firmwareVersion()
            },*/
            "fastbotArgs" : {
                "staticIPAddress": self.fastbot_staticIPAddress(),
                "staticIPNetmask": self.fastbot_staticIPNetmask(),
                "staticIPGateWay": self.fastbot_staticIPGateWay(),
            },
            "appearance" : {
                "name": self.appearance_name(),
                "color": self.appearance_color()
            },
            "printer": {
                "defaultExtrusionLength": self.printer_defaultExtrusionLength()
            },
            "webcam": {
                "streamUrl": self.webcam_streamUrl(),
                "snapshotUrl": self.webcam_snapshotUrl(),
                "ffmpegPath": self.webcam_ffmpegPath(),
                "bitrate": self.webcam_bitrate(),
                "watermark": self.webcam_watermark(),
                "flipH": self.webcam_flipH(),
                "flipV": self.webcam_flipV()
            },
            "feature": {
                "gcodeViewer": self.feature_gcodeViewer(),
                "temperatureGraph": self.feature_temperatureGraph(),
                "waitForStart": self.feature_waitForStart(),
                "alwaysSendChecksum": self.feature_alwaysSendChecksum(),
                "sdSupport": self.feature_sdSupport(),
                "sdAlwaysAvailable": self.feature_sdAlwaysAvailable(),
                "swallowOkAfterResend": self.feature_swallowOkAfterResend(),
                "repetierTargetTemp": self.feature_repetierTargetTemp()
            },
            "serial": {
                "port": self.serial_port(),
                "baudrate": self.serial_baudrate(),
                "autoconnect": self.serial_autoconnect(),
                "timeoutConnection": self.serial_timeoutConnection(),
                "timeoutDetection": self.serial_timeoutDetection(),
                "timeoutCommunication": self.serial_timeoutCommunication(),
                "timeoutTemperature": self.serial_timeoutTemperature(),
                "timeoutSdStatus": self.serial_timeoutSdStatus(),
                "log": self.serial_log()
            },
            "folder": {
                "uploads": self.folder_uploads(),
                "timelapse": self.folder_timelapse(),
                "timelapseTmp": self.folder_timelapseTmp(),
                "logs": self.folder_logs(),
                "watched": self.folder_watched()
            },
            "temperature": {
                "profiles": self.temperature_profiles()
            },
            "system": {
                "actions": self.system_actions()
            },
            "cura": {
                "enabled": self.cura_enabled(),
                "path": self.cura_path(),
                "config": self.cura_config()
            },
            "terminalFilters": self.terminalFilters()
        });

        $.ajax({
            url: API_BASEURL + "settings",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify(data),
            success: function(response) {
                self.fromResponse(response);
                $("#settings_dialog").modal("hide");
            }
        });
    };
}

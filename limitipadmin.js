
var userConf = {
	'container'				: 'div.row-fluid',
	'items'					: '',
	'submitBtn' 			: '#btn-submit-addlimitip',
	'checkCacheBtn'			: '#btn-submit-checkcache',
	'checkCacheContainer'	: '#check-cache-status',
	'addLimitIpUrl'			: 'global/addLimitIp',
	'getCluserIdUrl'		: 'global/getCluserId',
	'checkLimitIpCacheUrl'	: 'global/checkLimitIpCache',
	'statusItem'			: 'td > span.check-limitip',
	'inputs'				: 'input',
	'host'					: 'http://hyl.admin.yunpan.360.cn/',
	'inputRegIp'			: '^(([01]?[\\d]{1,2})|(2[0-4][\\d])|(25[0-5]))(\\.(([01]?[\\d]{1,2})|(2[0-4][\\d])|(25[0-5]))){3}$',
	'inputRegNum'			: '^[1-9]\\d*$',
};

(function($, $window, userConf){

	var _cids 			= []; 
	var _result 		= {}; //{'cid':'status'} 0-設置成功 1-設置失敗
	var _renderqueue 	= [];
	var _checkedip		= '';
	var _nodes 			= [];
	var _defaultConf 	= {
		'submitBtn' 			: '',
		'container' 			: '',
		'addLimitIpUrl'			: '',
		'getCluserIdUrl'		: '',
		'checkLimitIpCacheUrl'	: '',
		'statusItem'			: '',
		'inputs'				: '',
	};

	initConf(userConf);
	initEvent();

	function initConf(userConf)
	{
		$.extend(_defaultConf, userConf);
		userConf.container	= $(userConf.container);				
		userConf.submitBtn 	= userConf.container.find(userConf.submitBtn);
		userConf.statusItem = userConf.container.find(userConf.statusItem);
		userConf.inputs     = userConf.container.find(userConf.inputs);
		userConf.checkCacheContainer = userConf.container.find(userConf.checkCacheContainer);
		console.log(userConf.checkCacheContainer);
	}

	function initEvent()
	{
		$(userConf.submitBtn).bind("click", function (){
			//submit event
			var form = $(this).parent().parent().parent().parent();
			if (checkParams(form.find("input")))
			{
				form.submit(); 
			}

		});

		if(userConf.checkCacheBtn)
		{
			$(userConf.checkCacheBtn).bind("click", function (){
				//checkcache event				 
				 var form = $(this).parent().parent().parent().parent();
				 _checkedip = form.find("input").val();

				 try
				 {
	 				if(_checkedip == '')
					{
						throw new Error('ip不能為空');
					}
					userConf.checkCacheContainer.empty().addClass("table table-bordered table-striped");
					var title = '<tr class="success"><td>ip</td><td>所属集群</td><td>状态</td></tr>';
					userConf.checkCacheContainer.append($(title))
					_renderAction(userConf.container);
				 }
				 catch(e)
				 {
				 	alert(e.message);
				 }

			});
		}
	}

	function go(location)
	{
		var url = userConf.host + location;
		$window.location.href = url;
	}

	function request(request_url, params, callback)
	{		
		$.ajax({
			type 		: "GET",
			url 		: userConf.host + request_url,
			data 		: params,
			contentType	: "application/json; charset=utf-8",
			dataType	: "json",
			success		: function (data)
			{
				callback(data);
			},
			error		: function (msg)
			{
				alert(msg);
			}
		});
	}

	function loadCids(data) //get all cids
	{
		_cids.length = 0;
		for (var i in data)
		{
			_cids.push(data[i]);
		}
		return true;
	}

	function loadCheckLimitIpCacheRst(cid, ip, callback) //check ip cache in one cluser
	{
		var params 	= {
			'ip'	: ip,
			'cid'	: cid
		}
		var rst 	= request(userConf.checkLimitIpCacheUrl, params, callback);

		return rst;
	}

	function loadAllCheckLimitIpCacheRsts()
	{
		try
		{
			if(_cids.length == 0)
			{
				throw new Error('集群的id没有获取成功');
			}

			//_renderqueue.length = 0;
			_doLoop();
		}
		catch(e)
		{
			alert(e.message);
		}
	}

	var _timer;
	function _doLoop()
	{
		if(_cids.length != 0)
		{
			var ip 		= _checkedip;
			var cid 	= _cids.shift();
			var status 	= loadCheckLimitIpCacheRst(cid, ip, _loadRst);
			
			_timer = setTimeout(_doLoop, 100);			
		}
	}

	function _loadRst(data)
	{
		//_renderqueue.push(data);
		_renderIng(data);		
	}

	function _findNodeByCid(cid, nodes)
	{
		for(var i in nodes)
		{
			if(cid == $(nodes[i]).attr('data-cid'))
			{
				return $(nodes[i]);
			}
		}
		return false;
	}

	function _renderIng(data)
	{
		//var node = _findNodeByCid(data.cid, _nodes);
		var item = ['<tr class="item"><td>', _checkedip, '</td><td>'];// cid, '</td><td>', 状态, '</td></tr>'].join('');
		try
		{
			// if(node === false)
			// {
			// 	throw new Error('集群的id没有获取成功');
			// }
			item.push(data.cid + '</td><td>');
			
			if(data.value == 0)
			{
				//node.html('<p class="text-error">设置失败</p>');
				item.push('<p class="text-error">设置失败</p></td></tr>');
			}
			else
			{
				item.push('<p class="text-success">设置成功</p></td></tr>');
				//node.html('<p class="text-success">设置成功</p>');
			}
			userConf.checkCacheContainer.append(item.join(''));
		}
		catch(e)
		{
			clearTimeout(_timer);
			alert(e.message);
			//_renderNode(_nodes, "complete");
		}
	}

	function _renderNode(nodes, status)
	{		
		for (var i = 0; i < nodes.length; i++)
		{
			$(nodes[i]).button(status);
		}
		return _nodes;
	}

	function _loadNode(nodes)
	{		
		for (var i = 0; i < nodes.length; i++)
		{
			_nodes.push($(nodes[i]));
		}
		return true;
	}

	function _renderAction(parent)
	{
		//_loadNode(nodes);
		//_renderNode(_nodes, "loading");
		request(userConf.getCluserIdUrl, null, _renderStart);
	}

	function _renderStart(data)
	{
		loadCids(data);
		loadAllCheckLimitIpCacheRsts();
	}

	function switchMatch(input, conf)
	{	
		var regexp = '', label = '';

		switch ($(input).attr('data-regtype'))
		{
			case 'ip'	:
				regexp	= conf.inputRegIp;
				break;
			case 'num'	:
				regexp	= conf.inputRegNum;
				break;
		}
		label = $(input).attr('data-label');

		return { 'regexp' : regexp, 'label': label };
	}

	function checkParams(inputs)
	{
		var inputMatch, input, flag = true;

		try
		{
			for (var i = 0; i < inputs.length; i++)
			{
				inputMatch 	= switchMatch(inputs[i], userConf); 
				input 		= new Input(inputMatch.label, $(inputs[i]).val(), inputMatch.regexp, true, true);
				input.checkInvalid();			
			}
		}
		catch(e)
		{
			flag = false;
			alert(e.message);
		}

		return flag;
	}

	function Input(label, value, regexp, needcheck, needmatch)
	{
		this.label		= label,
		this.value  	= value;
		this.regexp 	= regexp;
		this.needcheck 	= needcheck;
		this.needmatch 	= needmatch;
	}

	Input.prototype.checkInvalid = function()
	{
		if(this.needcheck && this.value == '')
		{
			throw new Error(this.label + "不能为空");
		}

		if(this.needmatch && !new RegExp(this.regexp).test(this.value))
		{
			throw new Error(this.label + "格式不正确");
		}

		return true;
	}


})(jQuery, window, userConf);

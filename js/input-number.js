//验证输入值是否为数字
function isValueNumber(value) {
	return(/(^-?[0-9]+\.{1}\d+$)|(^-?[1-9]*$)|(^-?0{1}$)/).test(value + '');
}
Vue.component('input-number', {
	//模板
	template: `
	<div class="input-number">
       	<input type="text" :value="currentValue" @change="handleChange" @keyup.up='handleUp' @keyup.down='handleDown'/>
        <button @click="handleDown" :disabled="currentValue <= min">-</button>
        <button @click="handleUp" :disabled="currentValue >= max">+</button>
    </div>
	`,
	//props中的数据来自父组件
	//props实现与父组件的通信（父组件-->子组件）
	//对每个props进行校验，props的值可以是数组，也可以是对象，组件需要给别人使用时，推荐都进行数据验证
	props: {
		max: {
			//必须是数字类型
			type: Number,
			//默认值为Infinity
			default: Infinity
		},
		min: {
			type: Number,
			default: -Infinity
		},
		value: {
			type: Number,
			default: 0
		},
		step: {
			type: Number,
			default: 1
		}
	},
	//data是本组件的数据，作用域是组件本身
	//Vue组件为单向数据流，data为一个函数，currentValue设置为父组件的value，在input-number组件内部维护currentValue
	data: function() {
		return {
			//子组件将父组件传递过来的值进行保存，在本组件的作用域下进行使用
			currentValue: this.value
		}
	},
	//监听watch：监听data或者props的变化	
	watch: {
		//监听子组件currentValue是否改变
		currentValue: function(val) {
			//$emit与父组件通信  （子组件-->父组件）
			//this指向当前组件实例
			this.$emit('input', val);
			//定义自定义函数进行通信
			this.$emit('on-change', val)
		},
		//监听父组件value是否改变
		value: function(val) {
			this.updateValue(val);
		}
	},
	methods: {
		//父组件传递过来的值可能不符合条件（大于最大值，小于最小值）
		updateValue: function(val) {
			if(val > this.max) {
				val = this.max;
			}
			if(val < this.min) {
				val = this.min;
			}
			this.currentValue = val;
		},
		handleDown: function() {
			this.currentValue -= this.step;
			if(this.currentValue <= this.min) {
				this.currentValue = this.min;
			}
		},
		handleUp: function() {
			this.currentValue += this.step;
			if(this.currentValue >= this.max) {
				this.currentValue = this.max;
			}
		},
		handleChange: function(event) {
			var val = event.target.value.trim();
			var max = this.max;
			var min = this.min;
			if(isValueNumber(val)) {
				val = Number(val);
				this.currentValue = val;
				if(val > max) {
					this.current = max;
				}
				if(val < min) {
					this.current = min;
				}
			} else {
				//如果输入的不是数字，将输入的内容重置为之前的currentValue
				event.target.value = this.currentValue;
			}
		},
	},
	//初始化
	mounted: function() {
		this.updateValue(this.value);
	}
})
